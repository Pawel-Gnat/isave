import { NextResponse } from 'next/server';

import prisma from '@/lib/prisma';

import getCurrentUser from '@/actions/getCurrentUser';
import getIncomeCategories from '@/actions/getIncomeCategories';

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
    return NextResponse.json({ error: 'Nie dodano przychodu' }, { status: 404 });
  }

  if (
    (transactions as Transaction[]).find((t) => normalizeString(t.title).length === 0)
  ) {
    return NextResponse.json(
      { error: 'Należy podać nazwę każdego przychodu' },
      { status: 404 },
    );
  }

  if ((transactions as Transaction[]).find((t) => t.value <= 0)) {
    return NextResponse.json(
      { error: 'Wartosc każdej transakcji musi byc dodatnia' },
      { status: 404 },
    );
  }

  const incomeCategories = await getIncomeCategories();

  if (
    (transactions as Transaction[]).find(
      (t) => !incomeCategories.some((category) => category.id === t.categoryId),
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

  const groupIncome = await prisma.groupIncomes.create({
    data: {
      date: date,
      groupBudgetId: groupBudgetId,
      value: transactions.reduce(
        (acc: number, curr: { value: number }) => acc + curr.value * 100,
        0,
      ),
      userId: currentUser.id,
      userName: currentUser.name,
    },
  });

  for (const income of transactions) {
    await prisma.groupIncomeProduct.create({
      data: {
        title: normalizeString(income.title),
        value: income.value * 100,
        categoryId: income.categoryId,
        groupIncomeId: groupIncome.id,
      },
    });
  }

  return NextResponse.json('Utworzono nowy przychód');
}
