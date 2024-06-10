import { useQuery } from '@tanstack/react-query';

import getPersonalExpenses from '@/actions/getPersonalExpenses';

export default function usePersonalExpenses(dateFrom: Date, dateTo: Date) {
  const {
    data: personalExpenses,
    isLoading: isPersonalExpensesLoading,
    error: personalExpensesError,
    refetch: personalExpensesRefetch,
  } = useQuery({
    queryKey: ['personalExpenses', dateFrom, dateTo],
    queryFn: async () => await getPersonalExpenses({ from: dateFrom, to: dateTo }),
  });

  return {
    personalExpenses,
    isPersonalExpensesLoading,
    personalExpensesError,
    personalExpensesRefetch,
  };
}
