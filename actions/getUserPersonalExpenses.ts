'use server';

import prisma from '@/lib/prisma';

import getCurrentUser from './getCurrentUser';

const getUserPersonalExpenses = async () => {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return null;
    }

    const userPersonalExpenses = await prisma.personalExpenses.findMany({
      where: {
        userId: currentUser.id,
      },
    });

    if (!userPersonalExpenses) {
      return null;
    }

    return userPersonalExpenses;
  } catch (error) {
    return null;
  }
};

export default getUserPersonalExpenses;
