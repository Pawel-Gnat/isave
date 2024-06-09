import { useQuery } from '@tanstack/react-query';

import getPersonalIncomes from '@/actions/getPersonalIncomes';

export default function usePersonalIncomes(dateFrom?: Date, dateTo?: Date) {
  const {
    data: personalIncomes,
    isLoading: isPersonalIncomesLoading,
    error: personalIncomesError,
    refetch: personalIncomesRefetch,
  } = useQuery({
    queryKey: ['personalIncomes', dateFrom?.toISOString, dateTo?.toISOString],
    queryFn: async () => await getPersonalIncomes({ from: dateFrom, to: dateTo }),
  });

  return {
    personalIncomes,
    isPersonalIncomesLoading,
    personalIncomesError,
    personalIncomesRefetch,
  };
}
