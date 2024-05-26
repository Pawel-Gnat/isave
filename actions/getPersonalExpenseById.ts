'use server';

import prisma from '@/lib/prisma';

import getCurrentUser from './getCurrentUser';

const getPersonalExpenseById = async (expenseId: string) => {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return null;
    }

    const personalExpense = await prisma.personalExpenses.findUnique({
      where: {
        id: expenseId,
        userId: currentUser.id,
      },
      include: {
        transactions: true,
      },
    });

    if (!personalExpense) {
      return null;
    }

    const convertedTransactions = personalExpense.transactions.map((expense) => ({
      ...expense,
      value: expense.value / 100,
    }));

    return {
      ...personalExpense,
      value: personalExpense.value / 100,
      transactions: convertedTransactions,
    };
  } catch (error) {
    return null;
  }
};

export default getPersonalExpenseById;
