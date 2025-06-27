'use server';

import prisma from '@/lib/prisma';

import getCurrentUser from './getCurrentUser';

import { DateRange } from 'react-day-picker';

// const getGroupExpenses = async (date: DateRange, id: string) => {
//   try {
//     const currentUser = await getCurrentUser();

//     if (!currentUser) {
//       return null;
//     }

//     const groupExpenses = await prisma.groupExpenses.findMany({
//       where: {
//         groupBudgetId: id,
//         date: {
//           gte: date.from,
//           lte: date.to,
//         },
//       },
//       orderBy: {
//         date: 'desc',
//       },
//       include: {
//         transactions: true,
//       },
//     });

//     if (!groupExpenses) {
//       return null;
//     }

//     const convertedExpenses = groupExpenses.map((expense) => ({
//       ...expense,
//       value: expense.value / 100,
//     }));

//     return convertedExpenses;
//   } catch (error) {
//     return null;
//   }
// };

const getGroupExpenses = async (date: DateRange, id: string) => {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return null;
    }

    const groupBudget = await prisma.groupBudget.findUnique({
      where: {
        id: id,
      },
      include: {
        owner: true,
        members: {
          include: {
            user: true,
          },
        },
        groupExpenses: {
          where: {
            date: {
              gte: date.from,
              lte: date.to,
            },
          },
          orderBy: {
            date: 'desc',
          },
          include: {
            transactions: true,
          },
        },
      },
    });

    if (!groupBudget) {
      return null;
    }

    const convertedExpenses = groupBudget.groupExpenses.map((expense) => ({
      ...expense,
      value: expense.value / 100,
    }));

    const allMembers = [
      { id: groupBudget.ownerId, name: groupBudget.owner.name },
      ...groupBudget.members.map((member) => ({
        id: member.userId,
        name: member.user.name,
      })),
    ];

    const memberStatistics = allMembers.map((member) => {
      const memberExpenses = groupBudget.groupExpenses.filter(
        (expense) => expense.userId === member.id,
      );

      return {
        name: member.name,
        totalExpenses: memberExpenses.reduce(
          (sum, expense) => sum + expense.value / 100,
          0,
        ),
        totalIncomes: 0,
      };
    });

    const totalExpenses = groupBudget.groupExpenses.reduce(
      (sum, expense) => sum + expense.value / 100,
      0,
    );

    return {
      transactions: convertedExpenses,
      memberStatistics,
      budgetName: groupBudget.name,
      totalExpenses,
    };
  } catch (error) {
    return null;
  }
};

export default getGroupExpenses;
