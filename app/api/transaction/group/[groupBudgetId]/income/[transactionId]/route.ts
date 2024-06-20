import { NextResponse } from 'next/server';

import prisma from '@/lib/prisma';

import getCurrentUser from '@/actions/getCurrentUser';
import getIncomeCategories from '@/actions/getIncomeCategories';

import { normalizeString } from '@/utils/textUtils';

import { Transaction } from '@/types/types';

interface ParamsProps {
  transactionId: string;
}

export async function PATCH(request: Request, { params }: { params: ParamsProps }) {
  const { transactionId } = params;
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

  const currentIncome = await prisma.groupIncomes.findUnique({
    where: { id: transactionId },
  });

  if (!currentIncome || currentIncome.userId !== currentUser.id) {
    return NextResponse.json({ error: 'Dostęp nieupoważniony' }, { status: 403 });
  }

  await prisma.groupIncomes.update({
    where: {
      id: transactionId,
    },
    data: {
      date: date,
      value: transactions.reduce(
        (acc: number, curr: { value: number }) => acc + curr.value * 100,
        0,
      ),
    },
  });

  await prisma.groupIncomeProduct.deleteMany({
    where: {
      groupIncomeId: transactionId,
    },
  });

  for (const income of transactions) {
    await prisma.groupIncomeProduct.create({
      data: {
        title: normalizeString(income.title),
        value: income.value * 100,
        categoryId: income.categoryId,
        groupIncomeId: currentIncome.id,
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

  const currentIncome = await prisma.groupIncomes.findUnique({
    where: { id: transactionId },
  });

  if (!currentIncome || currentIncome.userId !== currentUser.id) {
    return NextResponse.json({ error: 'Dostęp nieupoważniony' }, { status: 403 });
  }

  await prisma.groupIncomes.delete({
    where: {
      id: transactionId,
    },
  });

  return NextResponse.json('Usunięto transakcję');
}
