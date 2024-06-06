import { useQuery } from '@tanstack/react-query';

import getIncomeCategories from '@/actions/getIncomeCategories';

export default function useIncomeCategories() {
  const {
    data: incomeCategories,
    isLoading: isIncomeCategoriesLoading,
    error: incomeCategoriesError,
  } = useQuery({
    queryKey: ['incomeCategories'],
    queryFn: async () => await getIncomeCategories(),
  });

  return {
    incomeCategories,
    isIncomeCategoriesLoading,
    incomeCategoriesError,
  };
}
