'use client';

import { endOfMonth, startOfMonth } from 'date-fns';

import useGroupBudgetsStatistics from '@/hooks/useGroupBudgetsStatistics';

import { Skeleton } from '@/components/ui/skeleton';

import { GroupBudgetCard } from './group-budget-card';

export const GroupBudgetsContainer = () => {
  const { groupBudgetsStatistics, isGroupBudgetsStatisticsLoading } =
    useGroupBudgetsStatistics(startOfMonth(new Date()), endOfMonth(new Date()));

  if (isGroupBudgetsStatisticsLoading) {
    return (
      <div className="my-4 grid grid-cols-2 gap-4">
        <Skeleton className="h-52 w-full" />
        <Skeleton className="h-52 w-full" />
      </div>
    );
  }

  return (
    <div className="my-4 grid grid-cols-2 gap-4">
      {groupBudgetsStatistics &&
        groupBudgetsStatistics.map((budget) => (
          <GroupBudgetCard key={budget.id} budget={budget} />
        ))}
    </div>
  );
};
