import { ExpenseCategory } from '@prisma/client';

export const simplifyCategories = (categories: ExpenseCategory[]) => {
  return categories.map(({ id, name }) => ({ id, name }));
};
