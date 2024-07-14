import { ChartConfig } from '@/components/ui/chart';

import { BudgetLabel } from './budget-label';
import { DoughnutChart } from './doughnut-chart';
import { DetailLink } from './detail-link';

import { GroupBudgetStatistics } from '@/types/types';

interface GroupIncomesCardProps {
  budget: GroupBudgetStatistics;
}

export const GroupIncomesCard = ({ budget }: GroupIncomesCardProps) => {
  const chartData = [
    {
      user: budget.owner.name,
      value: budget.owner.totalIncomes,
      fill: `hsl(var(--chart-1))`,
    },
    ...budget.members.map((member, index) => ({
      user: member.name,
      value: member.totalIncomes,
      fill: `hsl(var(--chart-${index + 2}))`,
    })),
  ];

  const chartConfig = {
    value: {
      label: 'value',
    },
    [budget.owner.name]: {
      label: budget.owner.name,
      color: 'hsl(var(--chart-1))',
    },
    ...budget.members.reduce(
      (acc, member, index) => {
        acc[member.name] = {
          label: member.name,
          color: `hsl(var(--chart-${index + 2}))`,
        };
        return acc;
      },
      {} as Record<string, any>,
    ),
  } satisfies ChartConfig;

  return (
    <div className="flex w-full flex-col justify-between gap-4 rounded-lg border p-6 shadow-sm">
      <div className="flex grow flex-row justify-between gap-4">
        {budget.totalIncomes > 0 ? (
          <DoughnutChart
            title={budget.name}
            description="Przychody z bieżącego miesiąca"
            chartData={chartData}
            chartConfig={chartConfig}
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
