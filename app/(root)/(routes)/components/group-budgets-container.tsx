'use client';

import useGroupBudgets from '@/hooks/useGroupBudgets';

import { Skeleton } from '@/components/ui/skeleton';

import { GroupBudgetCard } from './group-budget-card';

export const GroupBudgetsContainer = () => {
  const { groupBudgets, isGroupBudgetsLoading } = useGroupBudgets();

  if (isGroupBudgetsLoading) {
    return (
      <div className="my-4 grid grid-cols-2 gap-4">
        <Skeleton className="h-52 w-full" />
        <Skeleton className="h-52 w-full" />
      </div>
    );
  }

  return (
    <div className="my-4 grid grid-cols-2 gap-4">
      {groupBudgets &&
        groupBudgets.map((budget) => <GroupBudgetCard key={budget.id} budget={budget} />)}
    </div>
  );
};
