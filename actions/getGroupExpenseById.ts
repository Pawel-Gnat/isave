'use server';

import prisma from '@/lib/prisma';

import getCurrentUser from './getCurrentUser';

const getGroupExpenseById = async (expenseId: string) => {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return null;
    }

    const groupExpense = await prisma.groupExpenses.findUnique({
      where: {
        id: expenseId,
      },
      include: {
        transactions: true,
      },
    });

    if (!groupExpense) {
      return null;
    }

    const convertedTransactions = groupExpense.transactions.map((expense) => ({
      ...expense,
      value: expense.value / 100,
    }));

    return {
      ...groupExpense,
      value: groupExpense.value / 100,
      transactions: convertedTransactions,
    };
  } catch (error) {
    return null;
  }
};

export default getGroupExpenseById;
