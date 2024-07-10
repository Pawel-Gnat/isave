'use server';

import prisma from '@/lib/prisma';

import getCurrentUser from './getCurrentUser';

import { DateRange } from 'react-day-picker';

const getPersonalExpenses = async (date: DateRange) => {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return null;
    }

    const personalExpenses = await prisma.personalExpenses.findMany({
      where: {
        userId: currentUser.id,
        date: {
          gte: date.from,
          lte: date.to,
        },
      },
      include: {
        transactions: true,
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
