'use server';

import prisma from '@/lib/prisma';

import getCurrentUser from './getCurrentUser';

const getPersonalExpenses = async () => {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return null;
    }

    const personalExpenses = await prisma.personalExpenses.findMany({
      where: {
        userId: currentUser.id,
      },
    });

    if (!personalExpenses) {
      return null;
    }

    const convertedExpenses = personalExpenses.map((expense) => ({
      ...expense,
      value: expense.value / 100,
    }));

    return convertedExpenses;
  } catch (error) {
    return null;
  }
};

export default getPersonalExpenses;
