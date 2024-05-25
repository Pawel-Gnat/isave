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

    return personalIncome;
  } catch (error) {
    return null;
  }
};

export default getPersonalIncomeById;
