'use server';

import prisma from '@/lib/prisma';

const getExpenseCategories = async () => {
  try {
    const expenseCategories = await prisma.expenseCategory.findMany();

    return expenseCategories;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export default getExpenseCategories;
