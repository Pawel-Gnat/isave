import { useQuery } from '@tanstack/react-query';

import getPersonalStatistics from '@/actions/getPersonalStatistics';

export default function usePersonalStatistics(dateFrom: Date, dateTo: Date) {
  const {
    data: personalStatistics,
    isLoading: isPersonalStatisticsLoading,
    error: personalStatisticsError,
  } = useQuery({
    queryKey: ['personalStatistics', dateFrom, dateTo],
    queryFn: async () => await getPersonalStatistics({ from: dateFrom, to: dateTo }),
  });

  return {
    personalStatistics,
    isPersonalStatisticsLoading,
    personalStatisticsError,
  };
}
