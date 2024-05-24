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
    });

    if (!personalExpense) {
      return null;
    }

    return personalExpense;
  } catch (error) {
    return null;
  }
};

export default getPersonalExpenseById;
