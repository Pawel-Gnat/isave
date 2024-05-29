import { NextResponse } from 'next/server';

import prisma from '@/lib/prisma';

import getCurrentUser from '@/actions/getCurrentUser';

import normalizeString from '@/utils/normalizeString';

interface ParamsProps {
  transactionId: string;
}

export async function PATCH(request: Request, { params }: { params: ParamsProps }) {
  const { transactionId } = params;
  const body = await request.json();
  const { date, transactions } = body;

  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.json({ error: 'Dostęp nieupoważniony' }, { status: 401 });
  }

  const currentTransaction = await prisma.personalExpenses.findUnique({
    where: {
      id: transactionId,
      userId: currentUser.id,
    },
  });

  if (!currentTransaction) {
    return NextResponse.json({ error: 'Dostęp nieupoważniony' }, { status: 401 });
  }

  await prisma.personalExpenses.update({
    where: {
      id: transactionId,
      userId: currentUser.id,
    },
    data: {
      date: date,
      value: -transactions.reduce(
        (acc: number, curr: { value: number }) => acc + curr.value * 100,
        0,
      ),
    },
  });

  await prisma.personalExpenseProduct.deleteMany({
    where: {
      personalExpenseId: transactionId,
    },
  });

  for (const expense of transactions) {
    await prisma.personalExpenseProduct.create({
      data: {
        title: normalizeString(expense.title),
        value: expense.value * 100,
        categoryId: expense.categoryId,
        personalExpenseId: currentTransaction.id,
      },
    });
  }

  return NextResponse.json('Zaktualizowano transakcję');
}

export async function DELETE(request: Request, { params }: { params: ParamsProps }) {
  const { transactionId } = params;

  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.json({ error: 'Dostęp nieupoważniony' }, { status: 401 });
  }

  await prisma.personalExpenses.delete({
    where: {
      id: transactionId,
      userId: currentUser.id,
    },
  });

  return NextResponse.json('Usunięto transakcję');
}
