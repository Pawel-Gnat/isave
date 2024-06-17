import { useQuery } from '@tanstack/react-query';

import getGroupIncomes from '@/actions/getGroupIncomes';

export default function useGroupIncomes(dateFrom: Date, dateTo: Date, id: string) {
  const {
    data: groupIncomes,
    isLoading: isGroupIncomesLoading,
    error: groupIncomesError,
    refetch: groupIncomesRefetch,
  } = useQuery({
    queryKey: ['groupIncomes', dateFrom, dateTo, id],
    queryFn: async () => await getGroupIncomes({ from: dateFrom, to: dateTo }, id),
  });

  return {
    groupIncomes,
    isGroupIncomesLoading,
    groupIncomesError,
    groupIncomesRefetch,
  };
}
