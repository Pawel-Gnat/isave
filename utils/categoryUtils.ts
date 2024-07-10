import { ExpenseCategory, IncomeCategory } from '@prisma/client';

export const simplifyCategories = (categories: ExpenseCategory[]) => {
  return categories.map(({ id, name }) => ({ id, name }));
};

export const getCategoryName = (
  categories: ExpenseCategory[] | IncomeCategory[],
  categoryId: string,
) => {
  const category = categories?.find((c) => c.id === categoryId);
  return category ? category.name : 'Brak kategorii';
};
