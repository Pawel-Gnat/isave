'use server';

import prisma from '@/lib/prisma';

import getCurrentUser from './getCurrentUser';

import { DateRange } from 'react-day-picker';

const getGroupExpensesByUserId = async (
  date: DateRange,
  groupBudgetId: string,
  userId: string,
) => {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return null;
    }

    const groupExpenses = await prisma.groupExpenses.findMany({
      where: {
        groupBudgetId,
        userId,
        date: {
          gte: date.from,
          lte: date.to,
        },
      },
    });

    if (!groupExpenses) {
      return null;
    }

    const convertedExpenses = groupExpenses.map((expense) => ({
      ...expense,
      value: expense.value / 100,
    }));

    return convertedExpenses;
  } catch (error) {
    return null;
  }
};

export default getGroupExpensesByUserId;
