'use server';

import prisma from '@/lib/prisma';

import getCurrentUser from './getCurrentUser';

import { DateRange } from 'react-day-picker';

const getPersonalIncomes = async (date: DateRange) => {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return null;
    }

    const personalIncomes = await prisma.personalIncomes.findMany({
      where: {
        userId: currentUser.id,
        date: {
          gte: date.from,
          lte: date.to,
        },
      },
    });

    if (!personalIncomes) {
      return null;
    }

    const convertedIncomes = personalIncomes.map((income) => ({
      ...income,
      value: income.value / 100,
    }));

    return convertedIncomes;
  } catch (error) {
    return null;
  }
};

export default getPersonalIncomes;
