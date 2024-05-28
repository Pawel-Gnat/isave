import { NextResponse } from 'next/server';

import prisma from '@/lib/prisma';

import getCurrentUser from '@/actions/getCurrentUser';

export async function POST(request: Request) {
  const body = await request.json();
  const { date, transactions } = body;

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
        title: income.title,
        value: income.value * 100,
        categoryId: income.categoryId,
        personalIncomeId: personalIncome.id,
      },
    });
  }

  return NextResponse.json('Utworzono nowy przychód');
}
