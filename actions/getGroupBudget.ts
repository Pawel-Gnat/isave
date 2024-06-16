'use server';

import prisma from '@/lib/prisma';

import getCurrentUser from './getCurrentUser';

const getGroupBudgets = async () => {
  try {
    const currentUser = await getCurrentUser();

    const GroupBudgets = await prisma.groupBudget.findMany({
      where: {
        ownerId: currentUser?.id,
      },
      include: {
        members: true,
      },
    });

    return GroupBudgets;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export default getGroupBudgets;
