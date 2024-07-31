'use server';

import prisma from '@/lib/prisma';

import getCurrentUser from './getCurrentUser';

import { DateRange } from 'react-day-picker';

const getGroupExpenses = async (date: DateRange, id: string) => {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return null;
    }

    const groupExpenses = await prisma.groupExpenses.findMany({
      where: {
        groupBudgetId: id,
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

export default getGroupExpenses;
