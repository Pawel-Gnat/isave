'use server';

import prisma from '@/lib/prisma';

import getCurrentUser from './getCurrentUser';

const getGroupBudgets = async () => {
  try {
    const currentUser = await getCurrentUser();

    const groupBudgets = await prisma.groupBudget.findMany({
      where: {
        ownerId: currentUser?.id,
      },
      include: {
        members: true,
      },
    });

    return groupBudgets;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export default getGroupBudgets;
