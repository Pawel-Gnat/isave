'use client';

import useGroupBudgets from '@/hooks/useGroupBudgets';

import { Budget } from './budget';

export const SharedBudgets = () => {
  const { groupBudgets, isGroupBudgetsLoading } = useGroupBudgets();

  return (
    <ul className="space-y-4">
      <li>
        <Budget
          title="Budżet domowy"
          href="/group/1"
          users={[{ name: 'Pawel' }, { name: 'Agnieszka' }]}
        />
      </li>
      <li>
        <Budget title="Wyjazd rodzinny" href="/group/2" users={[{ name: 'Pawel' }]} />
      </li>
      <li>
        <Budget
          title="Fundusz oszczędnościowy"
          href="/group/3"
          users={[{ name: 'Pawel' }, { name: 'Agnieszka' }]}
        />
      </li>

      {groupBudgets?.map((budget) => (
        <li key={budget.id}>
          <Budget
            title={budget.name}
            href={`/group/${budget.id}`}
            users={[{ name: 'test' }]}
          />
        </li>
      ))}
    </ul>
  );
};
