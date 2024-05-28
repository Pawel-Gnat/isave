'use server';

import prisma from '@/lib/prisma';

import getCurrentUser from './getCurrentUser';

const getPersonalIncomes = async () => {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return null;
    }

    const personalIncomes = await prisma.personalIncomes.findMany({
      where: {
        userId: currentUser.id,
      },
    });

    if (!personalIncomes) {
      return null;
    }

    const convertedIncomes = personalIncomes.map((income) => ({
      ...income,
      value: income.value / 100,
    }));

    return convertedIncomes;
  } catch (error) {
    return null;
  }
};

export default getPersonalIncomes;
