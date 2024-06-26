import { NextResponse } from 'next/server';

import prisma from '@/lib/prisma';

import getCurrentUser from '@/actions/getCurrentUser';
import getExpenseCategories from '@/actions/getExpenseCategories';

import { normalizeString } from '@/utils/textUtils';

import { Transaction } from '@/types/types';

interface ParamsProps {
  groupBudgetId: string;
}

export async function POST(request: Request, { params }: { params: ParamsProps }) {
  const { groupBudgetId } = params;
  const body = await request.json();
  const { date, transactions } = body;

  if (!date) {
    return NextResponse.json({ error: 'Należy określić datę' }, { status: 404 });
  }

  if ((transactions as Transaction[]).length === 0) {
    return NextResponse.json({ error: 'Nie dodano wydatku' }, { status: 404 });
  }

  if (
    (transactions as Transaction[]).find((t) => normalizeString(t.title).length === 0)
  ) {
    return NextResponse.json(
      { error: 'Należy podać nazwę każdego wydatku' },
      { status: 404 },
    );
  }

  if ((transactions as Transaction[]).find((t) => t.value <= 0)) {
    return NextResponse.json(
      { error: 'Wartosc każdej transakcji musi byc dodatnia' },
      { status: 404 },
    );
  }

  const expenseCategories = await getExpenseCategories();

  if (
    (transactions as Transaction[]).find(
      (t) => !expenseCategories.some((category) => category.id === t.categoryId),
    )
  ) {
    return NextResponse.json(
      { error: 'Należy określic kategorie każdej transakcji' },
      { status: 404 },
    );
  }

  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.json({ error: 'Dostęp nieupoważniony' }, { status: 401 });
  }

  const groupBudget = await prisma.groupBudget.findUnique({
    where: {
      id: groupBudgetId,
    },
    include: {
      members: true,
    },
  });

  if (!groupBudget) {
    return NextResponse.json({ error: 'Nie znaleziono budżetu' }, { status: 404 });
  }

  const isOwner = groupBudget.ownerId === currentUser.id;
  const isMember = groupBudget.members.some((member) => member.userId === currentUser.id);

  if (!isOwner && !isMember) {
    return NextResponse.json({ error: 'Dostęp nieupoważniony' }, { status: 401 });
  }

  const groupExpense = await prisma.groupExpenses.create({
    data: {
      date: date,
      groupBudgetId: groupBudgetId,
      value: -transactions.reduce(
        (acc: number, curr: { value: number }) => acc + curr.value * 100,
        0,
      ),
      userId: currentUser.id,
      userName: currentUser.name,
    },
  });

  for (const expense of transactions) {
    await prisma.groupExpenseProduct.create({
      data: {
        title: normalizeString(expense.title),
        value: expense.value * 100,
        categoryId: expense.categoryId,
        groupExpenseId: groupExpense.id,
      },
    });
  }

  return NextResponse.json('Utworzono nowy wydatek');
}
