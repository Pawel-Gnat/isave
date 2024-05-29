import { NextResponse } from 'next/server';

import prisma from '@/lib/prisma';

import getCurrentUser from '@/actions/getCurrentUser';

import normalizeString from '@/utils/normalizeString';

export async function POST(request: Request) {
  const body = await request.json();
  const { date, transactions } = body;

  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.json({ error: 'Dostęp nieupoważniony' }, { status: 401 });
  }

  const personalExpense = await prisma.personalExpenses.create({
    data: {
      date: date,
      userId: currentUser.id,
      value: -transactions.reduce(
        (acc: number, curr: { value: number }) => acc + curr.value * 100,
        0,
      ),
    },
  });

  for (const expense of transactions) {
    await prisma.personalExpenseProduct.create({
      data: {
        title: normalizeString(expense.title),
        value: expense.value * 100,
        categoryId: expense.categoryId,
        personalExpenseId: personalExpense.id,
      },
    });
  }

  return NextResponse.json({ date, transactions });
}
