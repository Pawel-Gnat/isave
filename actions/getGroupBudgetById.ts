'use server';

import prisma from '@/lib/prisma';

import getCurrentUser from './getCurrentUser';

const getGroupBudgetById = async (id: string) => {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return null;
    }

    const groupBudget = await prisma.groupBudget.findUnique({
      where: {
        id: id,
      },
    });

    return groupBudget;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export default getGroupBudgetById;
