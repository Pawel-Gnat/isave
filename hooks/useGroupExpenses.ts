import { useQuery } from '@tanstack/react-query';

import getGroupExpenses from '@/actions/getGroupExpenses';

export default function useGroupExpenses(dateFrom: Date, dateTo: Date, id: string) {
  const {
    data: groupExpenses,
    isLoading: isGroupExpensesLoading,
    error: groupExpensesError,
    refetch: groupExpensesRefetch,
  } = useQuery({
    queryKey: ['groupExpenses', dateFrom, dateTo, id],
    queryFn: async () => await getGroupExpenses({ from: dateFrom, to: dateTo }, id),
  });

  return {
    groupExpenses,
    isGroupExpensesLoading,
    groupExpensesError,
    groupExpensesRefetch,
  };
}
