'use server';

import prisma from '@/lib/prisma';

const getIncomeCategories = async () => {
  try {
    const incomeCategories = await prisma.incomeCategory.findMany();

    return incomeCategories;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export default getIncomeCategories;
