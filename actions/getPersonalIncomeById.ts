'use server';

import prisma from '@/lib/prisma';

import getCurrentUser from './getCurrentUser';

const getPersonalIncomeById = async (incomeId: string) => {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return null;
    }

    const personalIncome = await prisma.personalIncomes.findUnique({
      where: {
        id: incomeId,
        userId: currentUser.id,
      },
      include: {
        transactions: true,
      },
    });

    if (!personalIncome) {
      return null;
    }

    const convertedTransactions = personalIncome.transactions.map((income) => ({
      ...income,
      value: income.value / 100,
    }));

    return {
      ...personalIncome,
      value: personalIncome.value / 100,
      transactions: convertedTransactions,
    };
  } catch (error) {
    return null;
  }
};

export default getPersonalIncomeById;
