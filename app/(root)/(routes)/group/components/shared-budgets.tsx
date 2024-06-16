'use client';

import Image from 'next/image';

import useGroupBudgets from '@/hooks/useGroupBudgets';

import { Budget } from './budget';

export const SharedBudgets = () => {
  const { groupBudgets, isGroupBudgetsLoading } = useGroupBudgets();

  if (isGroupBudgetsLoading) {
    return <p>Ładowanie</p>;
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
            users={[{ name: 'test' }]}
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
          <p className="font-medium">Brak transakcji dla wybranego okresu</p>
        </div>
      )}
    </div>
  );
};
