'use client';

import { endOfMonth, startOfMonth } from 'date-fns';

import usePersonalExpenses from '@/hooks/usePersonalExpenses';
import usePersonalIncomes from '@/hooks/usePersonalIncomes';

import { calculateTotal } from '@/utils/chartUtils';

import { Skeleton } from '@/components/ui/skeleton';
import { ChartConfig } from '@/components/ui/chart';

import { BarChart } from './bar-chart';
import { DetailLink } from './detail-link';

export const PersonalContainer = () => {
  const { personalExpenses, isPersonalExpensesLoading } = usePersonalExpenses(
    startOfMonth(new Date()),
    endOfMonth(new Date()),
  );

  const { personalIncomes, isPersonalIncomesLoading } = usePersonalIncomes(
    startOfMonth(new Date()),
    endOfMonth(new Date()),
  );

  const chartData = [
    {
      label: 'Transakcje',
      expenses: calculateTotal(personalExpenses || []) * -1,
      incomes: calculateTotal(personalIncomes || []),
    },
  ];

  const chartConfig = {
    expenses: {
      label: 'Wydatki',
      color: 'hsl(var(--chart-1))',
    },
    incomes: {
      label: 'Przychód',
      color: 'hsl(var(--chart-2))',
    },
  } satisfies ChartConfig;

  return (
    <div className="flex flex-col gap-4 lg:flex-row">
      {(isPersonalExpensesLoading || isPersonalIncomesLoading) && (
        <Skeleton className="h-96 w-full lg:h-full lg:w-96" />
      )}

      {personalExpenses && personalIncomes && (
        <BarChart
          title="Budżet osobisty"
          description="Zestawienie z bieżącego miesiąca"
          chartData={chartData}
          chartConfig={chartConfig}
        />
      )}

      <div className="flex flex-col justify-center gap-4">
        {(isPersonalExpensesLoading || isPersonalIncomesLoading) && (
          <Skeleton className="h-64 w-full lg:w-52" />
        )}

        {personalExpenses && personalIncomes && (
          <div className="flex h-full flex-col items-end justify-between gap-4 rounded-lg border p-4 sm:p-6 lg:w-52">
            <div className="space-y-4 text-right">
              <div>
                <p>Wydatki osobiste</p>
                <p className="mt-2 text-lg font-bold sm:text-xl">
                  {personalExpenses && calculateTotal(personalExpenses)} zł
                </p>
              </div>
              <div>
                <p>Przychody osobiste</p>
                <p className="mt-2 text-lg font-bold sm:text-xl">
                  {personalIncomes && calculateTotal(personalIncomes)} zł
                </p>
              </div>
            </div>
            <DetailLink src="/statistics/personal" />
          </div>
        )}
      </div>
    </div>
  );
};
