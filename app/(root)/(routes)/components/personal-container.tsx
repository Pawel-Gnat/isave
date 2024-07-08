'use client';

import { endOfMonth, startOfMonth } from 'date-fns';

import usePersonalExpenses from '@/hooks/usePersonalExpenses';
import usePersonalIncomes from '@/hooks/usePersonalIncomes';

import { Skeleton } from '@/components/ui/skeleton';

import { BarChart } from './bar-chart';
import { DetailLink } from './detail-link';

export const PersonalContainer = () => {
  const { personalExpenses, isPersonalExpensesLoading } = usePersonalExpenses(
    startOfMonth(new Date()),
    endOfMonth(new Date()),
  );

  console.log(personalExpenses);

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
                data: [-personalExpenses.reduce((acc, curr) => acc + curr.value, 0)],
                backgroundColor: 'rgba(27, 38, 59, 1)',
                borderColor: 'rgba(27, 38, 59, 1)',
              },
              {
                label: 'Przychody',
                data: [personalIncomes.reduce((acc, curr) => acc + curr.value, 0)],
                backgroundColor: 'rgba(65, 90, 119, 1)',
                borderColor: 'rgba(65, 90, 119, 1)',
              },
            ],
          }}
        />
      )}

      <div className="flex flex-col justify-center gap-4">
        {(isPersonalExpensesLoading || isPersonalIncomesLoading) && (
          <Skeleton className="h-64 w-52" />
        )}

        {personalExpenses && personalIncomes && (
          <div className="flex h-64 w-52 flex-col items-end justify-between gap-4 rounded-lg border p-4">
            <div>
              <p>Wydatki osobiste</p>
              <p className="mt-2 text-right text-xl font-bold">
                {personalExpenses &&
                  personalExpenses
                    .reduce((acc, curr) => acc + curr.value, 0)
                    .toFixed(2)}{' '}
                zł
              </p>
            </div>
            <div>
              <p>Przychody osobiste</p>
              <p className="mt-2 text-right text-xl font-bold">
                {personalIncomes &&
                  personalIncomes
                    .reduce((acc, curr) => acc + curr.value, 0)
                    .toFixed(2)}{' '}
                zł
              </p>
            </div>
            <DetailLink src="/statistics/personal" />
          </div>
        )}
      </div>
    </div>
  );
};
