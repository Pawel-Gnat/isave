import { NextResponse } from 'next/server';

import prisma from '@/lib/prisma';

interface ParamsProps {
  id: string;
}

export async function PATCH(request: Request, { params }: { params: ParamsProps }) {
  const { id } = params;

  // if (!date) {
  //   return NextResponse.json({ error: 'Należy określić datę' }, { status: 404 });
  // }

  // if ((transactions as Transaction[]).length === 0) {
  //   return NextResponse.json({ error: 'Nie dodano wydatku' }, { status: 404 });
  // }

  // if (
  //   (transactions as Transaction[]).find((t) => normalizeString(t.title).length === 0)
  // ) {
  //   return NextResponse.json(
  //     { error: 'Należy podać nazwę każdego wydatku' },
  //     { status: 404 },
  //   );
  // }

  // if ((transactions as Transaction[]).find((t) => t.value <= 0)) {
  //   return NextResponse.json(
  //     { error: 'Wartosc każdej transakcji musi byc dodatnia' },
  //     { status: 404 },
  //   );
  // }

  // const expenseCategories = await getExpenseCategories();

  // if (
  //   (transactions as Transaction[]).find(
  //     (t) => !expenseCategories.some((category) => category.id === t.categoryId),
  //   )
  // ) {
  //   return NextResponse.json(
  //     { error: 'Należy określic kategorie każdej transakcji' },
  //     { status: 404 },
  //   );
  // }

  // const currentUser = await getCurrentUser();

  // if (!currentUser) {
  //   return NextResponse.json({ error: 'Dostęp nieupoważniony' }, { status: 401 });
  // }

  // const currentTransaction = await prisma.personalExpenses.findUnique({
  //   where: {
  //     id: transactionId,
  //     userId: currentUser.id,
  //   },
  // });

  // if (!currentTransaction) {
  //   return NextResponse.json({ error: 'Dostęp nieupoważniony' }, { status: 401 });
  // }

  // await prisma.personalExpenses.update({
  //   where: {
  //     id: transactionId,
  //     userId: currentUser.id,
  //   },
  //   data: {
  //     date: date,
  //     value: -transactions.reduce(
  //       (acc: number, curr: { value: number }) => acc + curr.value * 100,
  //       0,
  //     ),
  //   },
  // });

  // await prisma.personalExpenseProduct.deleteMany({
  //   where: {
  //     personalExpenseId: transactionId,
  //   },
  // });

  // for (const expense of transactions) {
  //   await prisma.personalExpenseProduct.create({
  //     data: {
  //       title: normalizeString(expense.title),
  //       value: expense.value * 100,
  //       categoryId: expense.categoryId,
  //       personalExpenseId: currentTransaction.id,
  //     },
  //   });
  // }

  return NextResponse.json('Aktywowano konto');
}
