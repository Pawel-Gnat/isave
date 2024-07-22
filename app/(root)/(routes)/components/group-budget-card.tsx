import { ChartConfig } from '@/components/ui/chart';
import { Separator } from '@/components/ui/separator';

import { BudgetLabel } from './budget-label';
import { DoughnutChart } from './doughnut-chart';
import { DetailLink } from './detail-link';

import { GroupBudgetStatistics } from '@/types/types';

interface GroupBudgetCardProps {
  budget: GroupBudgetStatistics;
}

export const GroupBudgetCard = ({ budget }: GroupBudgetCardProps) => {
  const chartExpensesData = [
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

  const chartExpensesConfig = {
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

  const chartIncomesData = [
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

  const chartIncomesConfig = {
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
    <div className="flex w-full flex-col justify-between gap-4 rounded-lg border p-4 sm:p-6">
      <div className="flex grow flex-col justify-between gap-4 sm:flex-row">
        {budget.totalExpenses < 0 ? (
          <DoughnutChart
            title={`${budget.name} - wydatki`}
            description="Zestawienie z bieżącego miesiąca"
            chartData={chartExpensesData}
            chartConfig={chartExpensesConfig}
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
        </div>
      </div>

      <Separator />

      <div className="flex grow flex-col justify-between gap-4 sm:flex-row">
        {budget.totalIncomes > 0 ? (
          <DoughnutChart
            title={`${budget.name} - przychody`}
            description="Zestawienie z bieżącego miesiąca"
            chartData={chartIncomesData}
            chartConfig={chartIncomesConfig}
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
          <DetailLink src={`/statistics/${budget.id}`} />
        </div>
      </div>
    </div>
  );
};
