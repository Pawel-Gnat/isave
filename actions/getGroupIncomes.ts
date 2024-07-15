'use server';

import prisma from '@/lib/prisma';

import getCurrentUser from './getCurrentUser';

import { DateRange } from 'react-day-picker';

const getGroupIncomes = async (date: DateRange, id: string) => {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return null;
    }

    const groupIncomes = await prisma.groupIncomes.findMany({
      where: {
        groupBudgetId: id,
        date: {
          gte: date.from,
          lte: date.to,
        },
      },
      include: {
        transactions: true,
      },
    });

    if (!groupIncomes) {
      return null;
    }

    const convertedIncomes = groupIncomes.map((expense) => ({
      ...expense,
      value: expense.value / 100,
    }));

    return convertedIncomes;
  } catch (error) {
    return null;
  }
};

export default getGroupIncomes;
