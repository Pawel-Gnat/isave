import { NextResponse } from 'next/server';

import prisma from '@/lib/prisma';

import getCurrentUser from '@/actions/getCurrentUser';
import getIncomeCategories from '@/actions/getIncomeCategories';

import normalizeString from '@/utils/normalizeString';

import { Transaction } from '@/types/types';

export async function POST(request: Request) {
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

  const personalIncome = await prisma.personalIncomes.create({
    data: {
      date: date,
      userId: currentUser.id,
      value: transactions.reduce(
        (acc: number, curr: { value: number }) => acc + curr.value * 100,
        0,
      ),
    },
  });

  for (const income of transactions) {
    await prisma.personalIncomeProduct.create({
      data: {
        title: normalizeString(income.title),
        value: income.value * 100,
        categoryId: income.categoryId,
        personalIncomeId: personalIncome.id,
      },
    });
  }

  return NextResponse.json('Utworzono nowy przychód');
}
