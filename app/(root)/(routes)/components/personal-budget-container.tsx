'use client';

import { endOfMonth, startOfMonth } from 'date-fns';

import usePersonalExpenses from '@/hooks/usePersonalExpenses';
import usePersonalIncomes from '@/hooks/usePersonalIncomes';

import { Skeleton } from '@/components/ui/skeleton';

import { StatsCard } from './stats-card';
import { BarChart } from './bar-chart';

export const PersonalBudgetContainer = () => {
  const { personalExpenses, isPersonalExpensesLoading } = usePersonalExpenses(
    startOfMonth(new Date()),
    endOfMonth(new Date()),
  );

  const { personalIncomes, isPersonalIncomesLoading } = usePersonalIncomes(
    startOfMonth(new Date()),
    endOfMonth(new Date()),
  );

  return (
    <div className="flex flex-row gap-4">
      {(isPersonalExpensesLoading || isPersonalIncomesLoading) && (
        <Skeleton className="h-full w-96" />
      )}

      {personalExpenses && personalIncomes && (
        <BarChart
          chartData={{
            labels: ['Budżet osobisty'],
            datasets: [
              {
                label: 'Wydatki',
                data: [-personalExpenses[0].value],
                backgroundColor: 'rgba(27, 38, 59, 1)',
                borderColor: 'rgba(27, 38, 59, 1)',
              },
              {
                label: 'Przychody',
                data: [personalIncomes[0].value],
                backgroundColor: 'rgba(65, 90, 119, 1)',
                borderColor: 'rgba(65, 90, 119, 1)',
              },
            ],
          }}
        />
      )}

      <div className="flex flex-col justify-center gap-4">
        <StatsCard
          heading="Wydatki osobiste"
          data={personalExpenses}
          isLoading={isPersonalExpensesLoading}
        />
        <StatsCard
          heading="Przychody osobiste"
          data={personalIncomes}
          isLoading={isPersonalIncomesLoading}
        />
      </div>
    </div>
  );
};
