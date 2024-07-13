import { getCategoryName } from './categoryUtils';

import {
  GroupedTransactions,
  ModifiedPersonalExpense,
  ModifiedPersonalIncome,
  Transaction,
} from '@/types/types';
import { ExpenseCategory, IncomeCategory } from '@prisma/client';

export const flatTransactions = (
  transactions: ModifiedPersonalIncome[] | ModifiedPersonalExpense[],
) => {
  return transactions.flatMap((stat) => stat.transactions);
};

export const groupTransactions = (transactions: Transaction[]) => {
  return transactions.reduce<GroupedTransactions>((acc, transaction) => {
    const { categoryId, value } = transaction;
    if (!acc[categoryId]) {
      acc[categoryId] = 0;
    }
    acc[categoryId] += value;
    return acc;
  }, {});
};

export const createChartData = (
  categories: ExpenseCategory[] | IncomeCategory[],
  groupedTransactions: { [key: string]: number },
) => {
  return Object.entries(groupedTransactions).map(([categoryId, value]) => ({
    categoryName: getCategoryName(categories, categoryId),
    value: +(value / 100).toFixed(2),
  }));
};

export const calculateTotal = (
  transactions: ModifiedPersonalExpense[] | ModifiedPersonalIncome[],
) => {
  return +transactions.reduce((acc, curr) => acc + curr.value, 0).toFixed(2);
};
