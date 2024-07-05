import { FC } from 'react';

import { BudgetLabel } from './budget-label';
import { DoughnutChart } from './doughnut-chart';
import { DetailLink } from './detail-link';

import { GroupBudgetStatistics } from '@/types/types';

interface GroupIncomesCardProps {
  budget: GroupBudgetStatistics;
}

export const GroupIncomesCard: FC<GroupIncomesCardProps> = ({ budget }) => {
  return (
    <div className="flex flex-col justify-between gap-4 rounded-lg border p-4">
      <p>{budget.name} - przychody</p>
      <div className="flex grow flex-row justify-between gap-4">
        {budget.totalIncomes > 0 ? (
          <DoughnutChart
            chartData={{
              datasets: [
                {
                  label: 'Przychody',
                  data: [budget.owner, ...budget.members].map(
                    (user) => user.totalIncomes,
                  ),
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
        ) : (
          <p className="m-auto">Brak przychodów</p>
        )}

        <div className="flex flex-col items-end gap-4">
          {[budget.owner, ...budget.members].map((user, index) => (
            <BudgetLabel key={index} name={user.name} totalExpenses={user.totalIncomes} />
          ))}

          <p className="mt-auto text-right text-xl font-bold">
            {budget.totalIncomes.toFixed(2)} zł
          </p>
          <DetailLink src="/" />
        </div>
      </div>
    </div>
  );
};
