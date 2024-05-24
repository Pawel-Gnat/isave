import { NextResponse } from 'next/server';

import prisma from '@/lib/prisma';

import getCurrentUser from '@/actions/getCurrentUser';

export async function POST(request: Request) {
  const body = await request.json();
  const { date, transactions } = body;

  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const personalExpense = await prisma.personalExpenses.create({
    data: {
      date: date,
      userId: currentUser.id,
      value: -transactions.reduce(
        (acc: number, curr: { value: number }) => acc + curr.value,
        0,
      ),
    },
  });

  for (const expense of transactions) {
    await prisma.personalExpenseProduct.create({
      data: {
        title: expense.title,
        value: expense.value,
        categoryId: expense.categoryId,
        personalExpenseId: personalExpense.id,
      },
    });
  }

  return NextResponse.json({ date, transactions });
}
