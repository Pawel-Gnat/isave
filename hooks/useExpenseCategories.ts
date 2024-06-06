import { useQuery } from '@tanstack/react-query';

import getExpenseCategories from '@/actions/getExpenseCategories';

export default function useExpenseCategories() {
  const {
    data: expenseCategories,
    isLoading: isExpenseCategoriesLoading,
    error: expenseCategoriesError,
  } = useQuery({
    queryKey: ['expenseCategories'],
    queryFn: async () => await getExpenseCategories(),
  });

  return {
    expenseCategories,
    isExpenseCategoriesLoading,
    expenseCategoriesError,
  };
}
