'use server';

import prisma from '@/lib/prisma';

import getCurrentUser from './getCurrentUser';

const getGroupIncomeById = async (incomeId: string) => {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return null;
    }

    const groupIncome = await prisma.groupIncomes.findUnique({
      where: {
        id: incomeId,
      },
      include: {
        transactions: true,
      },
    });

    if (!groupIncome) {
      return null;
    }

    const convertedTransactions = groupIncome.transactions.map((income) => ({
      ...income,
      value: income.value / 100,
    }));

    return {
      ...groupIncome,
      value: groupIncome.value / 100,
      transactions: convertedTransactions,
    };
  } catch (error) {
    return null;
  }
};

export default getGroupIncomeById;
