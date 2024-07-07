import { useQuery } from '@tanstack/react-query';

import getPersonalStatistics from '@/actions/getPersonalStatistics';

export default function usePersonalStatistics(dateFrom: Date, dateTo: Date) {
  const {
    data: personalStatistics,
    isLoading: isGetPersonalStatisticsLoading,
    error: getPersonalStatisticsError,
  } = useQuery({
    queryKey: ['personalStatistics', dateFrom, dateTo],
    queryFn: async () => await getPersonalStatistics({ from: dateFrom, to: dateTo }),
  });

  return {
    personalStatistics,
    isGetPersonalStatisticsLoading,
    getPersonalStatisticsError,
  };
}
