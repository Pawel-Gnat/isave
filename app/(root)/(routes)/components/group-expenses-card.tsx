import { ChartConfig } from '@/components/ui/chart';

import { BudgetLabel } from './budget-label';
import { DoughnutChart } from './doughnut-chart';
import { DetailLink } from './detail-link';

import { GroupBudgetStatistics } from '@/types/types';

interface GroupExpensesCardProps {
  budget: GroupBudgetStatistics;
}

export const GroupExpensesCard = ({ budget }: GroupExpensesCardProps) => {
  const chartData = [
    {
      user: budget.owner.name,
      value: budget.owner.totalExpenses * -1,
      fill: `hsl(var(--chart-1))`,
    },
    ...budget.members.map((member, index) => ({
      user: member.name,
      value: member.totalExpenses * -1,
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
    <div className="flex flex-col justify-between gap-4 rounded-lg border p-6 w-full">
      <div className="flex grow flex-row justify-between gap-4">
        {budget.totalExpenses < 0 ? (
          <DoughnutChart
            title={budget.name}
            description="Wydatki z bieżącego miesiąca"
            chartData={chartData}
            chartConfig={chartConfig}
          />
        ) : (
          <p className="m-auto">Brak wydatków</p>
        )}

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
          <DetailLink src="/statistics/group/id" />
        </div>
      </div>
    </div>
  );
};
