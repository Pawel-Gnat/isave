'use server';

import prisma from '@/lib/prisma';

import getCurrentUser from './getCurrentUser';

const getGroupBudgets = async () => {
  try {
    const currentUser = await getCurrentUser();

    const ownerBudgets = await prisma.groupBudget.findMany({
      where: {
        ownerId: currentUser?.id,
      },
      include: {
        members: true,
      },
    });

    const memberBudgets = await prisma.groupBudgetMember.findMany({
      where: {
        userId: currentUser?.id,
      },
      include: {
        groupBudget: {
          include: {
            members: true,
          },
        },
      },
    });

    const memberBudgetsOnly = memberBudgets.map((member) => member.groupBudget);
    const allBudgets = [...ownerBudgets, ...memberBudgetsOnly];

    return allBudgets;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export default getGroupBudgets;
