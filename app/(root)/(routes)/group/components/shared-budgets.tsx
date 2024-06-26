'use client';

import Image from 'next/image';

import useGroupBudgets from '@/hooks/useGroupBudgets';

import { Skeleton } from '@/components/ui/skeleton';

import { Budget } from './budget';

export const SharedBudgets = ({ userId }: { userId: string }) => {
  const { groupBudgets, isGroupBudgetsLoading } = useGroupBudgets();

  if (isGroupBudgetsLoading) {
    return (
      <div className="flex flex-1 flex-col gap-4">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-4">
      {groupBudgets && groupBudgets.length > 0 ? (
        groupBudgets.map((budget) => (
          <Budget
            key={budget.id}
            title={budget.name}
            id={budget.id}
            href={`/group/${budget.id}`}
            ownerId={budget.ownerId}
            members={budget.members}
            userId={userId}
          />
        ))
      ) : (
        <div className="m-auto text-center">
          <Image
            src="/empty.png"
            alt="Brak transakcji"
            width={300}
            height={300}
            className="aspect-square"
          />
          <p className="font-medium">Brak budżetów</p>
        </div>
      )}
    </div>
  );
};
