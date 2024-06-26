import { FC } from 'react';

import { BudgetLabel } from './budget-label';

import DoughnutChart from './doughnut-chart';

import { GroupBudgetStatistics } from '@/types/types';

interface GroupBudgetCardProps {
  budget: GroupBudgetStatistics;
}

export const GroupBudgetCard: FC<GroupBudgetCardProps> = ({ budget }) => {
  return (
    <div className="flex flex-col justify-between gap-4 rounded-lg border p-4">
      <p>{budget.name} - wydatki</p>
      <div className="flex flex-row justify-between gap-4">
        <DoughnutChart
          chartData={{
            datasets: [
              {
                label: 'Wydatki',
                data: [budget.owner, ...budget.members].map((user) => user.totalExpenses),
                backgroundColor: [
                  'rgba(27, 38, 59, 1)',
                  'rgba(65, 90, 119, 1)',
                  'rgba(119, 141, 169, 1)',
                  'rgba(224, 225, 221, 1)',
                ],
                borderColor: [
                  'rgba(27, 38, 59, 1)',
                  'rgba(65, 90, 119, 1)',
                  'rgba(119, 141, 169, 1)',
                  'rgba(224, 225, 221, 1)',
                ],
                borderWidth: 1,
              },
            ],
          }}
        />

        <div className="flex flex-col items-end gap-4">
          {[budget.owner, ...budget.members].map((user, index) => (
            <BudgetLabel
              key={index}
              name={user.name}
              totalExpenses={user.totalExpenses}
            />
          ))}

          <p className="mt-auto text-right text-xl font-bold">
            {budget.totalExpenses.toFixed(2)} zł
          </p>
        </div>
      </div>
    </div>
  );
};
