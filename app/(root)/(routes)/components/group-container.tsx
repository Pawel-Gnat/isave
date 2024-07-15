'use client';

import { endOfMonth, startOfMonth } from 'date-fns';

import useGroupBudgetsStatistics from '@/hooks/useGroupBudgetsStatistics';

import { Skeleton } from '@/components/ui/skeleton';

import { GroupBudgetCard } from './group-budget-card';

export const GroupContainer = () => {
  const { groupBudgetsStatistics, isGroupBudgetsStatisticsLoading } =
    useGroupBudgetsStatistics(startOfMonth(new Date()), endOfMonth(new Date()));

  if (isGroupBudgetsStatisticsLoading) {
    return (
      <div className="my-4 grid max-w-screen-2xl grid-cols-2 gap-4">
        <Skeleton className="h-96 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="my-4 grid max-w-screen-2xl grid-cols-2 gap-4">
      {groupBudgetsStatistics &&
        groupBudgetsStatistics.map((budget) => (
          <div key={budget.id} className="space-y-4">
            <GroupBudgetCard budget={budget} />
          </div>
        ))}
    </div>
  );
};
