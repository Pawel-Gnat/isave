import { useQuery } from '@tanstack/react-query';

import getPersonalBudget from '@/actions/getPersonalBudget';

export default function usePersonalBudget(dateFrom: Date, dateTo: Date) {
  const {
    data: personalBudget,
    isLoading: isPersonalBudgetLoading,
    error: personalBudgetError,
    refetch: personalBudgetRefetch,
  } = useQuery({
    queryKey: ['personalBudget', dateFrom, dateTo],
    queryFn: async () => await getPersonalBudget({ from: dateFrom, to: dateTo }),
  });

  return {
    personalBudget,
    isPersonalBudgetLoading,
    personalBudgetError,
    personalBudgetRefetch,
  };
}
