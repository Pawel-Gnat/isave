'use server';

import prisma from '@/lib/prisma';

import getCurrentUser from './getCurrentUser';

import { DateRange } from 'react-day-picker';

const getPersonalBudget = async (date: DateRange) => {
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
      orderBy: {
        date: 'desc',
      },
      include: {
        transactions: true,
      },
    });

    if (!personalExpenses) {
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
      orderBy: {
        date: 'desc',
      },
      include: {
        transactions: true,
      },
    });

    if (!personalIncomes) {
      return null;
    }

    const convertedIncomes = personalIncomes.map((income) => ({
      ...income,
      value: income.value / 100,
    }));

    const convertedExpenses = personalExpenses.map((expense) => ({
      ...expense,
      value: expense.value / 100,
    }));

    return {
      incomes: convertedIncomes,
      expenses: convertedExpenses,
    };
  } catch (error) {
    return null;
  }
};

export default getPersonalBudget;
