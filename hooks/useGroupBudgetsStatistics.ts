import { useQuery } from '@tanstack/react-query';

import getGroupBudgetsStatistics from '@/actions/getGroupBudgetsStatistics';

export default function useGroupBudgetsStatistics(dateFrom: Date, dateTo: Date) {
  const {
    data: groupBudgetsStatistics,
    isLoading: isGroupBudgetsStatisticsLoading,
    error: groupBudgetsStatisticsError,
  } = useQuery({
    queryKey: ['groupBudgetsStatistics', dateFrom, dateTo],
    queryFn: async () => await getGroupBudgetsStatistics({ from: dateFrom, to: dateTo }),
  });

  return {
    groupBudgetsStatistics,
    isGroupBudgetsStatisticsLoading,
    groupBudgetsStatisticsError,
  };
}
