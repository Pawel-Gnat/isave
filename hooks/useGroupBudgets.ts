import { useQuery } from '@tanstack/react-query';

import getGroupBudgets from '@/actions/getGroupBudget';

export default function useGroupBudgets() {
  const {
    data: groupBudgets,
    isLoading: isGroupBudgetsLoading,
    error: groupBudgetsError,
    refetch: groupBudgetsRefetch,
  } = useQuery({
    queryKey: ['groupBudgets'],
    queryFn: async () => await getGroupBudgets(),
  });

  return {
    groupBudgets,
    isGroupBudgetsLoading,
    groupBudgetsError,
    groupBudgetsRefetch,
  };
}
