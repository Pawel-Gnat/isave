'use client';

import { useState } from 'react';
import { endOfMonth, startOfMonth } from 'date-fns';

import useExpenseCategories from '@/hooks/useExpenseCategories';
import useGroupExpenses from '@/hooks/useGroupExpenses';
import useGroupIncomes from '@/hooks/useGroupIncomes';
import useIncomeCategories from '@/hooks/useIncomeCategories';

import { DatePicker } from '@/components/shared/date-picker';
import { BarChart } from '@/components/charts/bar-chart';

import { Chart } from './chart';

import { DateRange } from 'react-day-picker';

interface ChartsContainerProps {
  budgetId: string;
}

export const ChartsContainer = ({ budgetId }: ChartsContainerProps) => {
  const [date, setDate] = useState<DateRange>({
    from: startOfMonth(new Date()),
    to: endOfMonth(new Date()),
  });
  const { groupExpenses, isGroupExpensesLoading } = useGroupExpenses(
    date.from || startOfMonth(new Date()),
    date.to || endOfMonth(new Date()),
    budgetId,
  );
  const { groupIncomes, isGroupIncomesLoading } = useGroupIncomes(
    date.from || startOfMonth(new Date()),
    date.to || endOfMonth(new Date()),
    budgetId,
  );
  const { expenseCategories, isExpenseCategoriesLoading } = useExpenseCategories();
  const { incomeCategories, isIncomeCategoriesLoading } = useIncomeCategories();

  const handleDateChange = (newDate: DateRange | undefined) => {
    if (newDate) {
      setDate(newDate);
    }
  };

  return (
    <div className="flex grow flex-col gap-4">
      <DatePicker date={date} setDate={handleDateChange} />
      <Chart
        title="Zestawienie wydatków"
        description="Wykres przedstawia kategorie wydatków z ich kosztem sumarycznym"
        isLoading={isGroupExpensesLoading && isExpenseCategoriesLoading}
        categories={expenseCategories}
        transactions={groupExpenses}
        chart={(chartData, chartConfig, title, description) => (
          <BarChart
            chartData={chartData}
            chartConfig={chartConfig}
            title={title}
            description={description}
          />
        )}
      />
      <div className="max-w-[640px]">
        <Chart
          title="Zestawienie przychodów"
          description="Wykres przedstawia kategorie przychodów z ich zyskiem sumarycznym"
          isLoading={isGroupIncomesLoading && isIncomeCategoriesLoading}
          categories={incomeCategories}
          transactions={groupIncomes}
          chart={(chartData, chartConfig, title, description) => (
            <BarChart
              chartData={chartData}
              chartConfig={chartConfig}
              title={title}
              description={description}
            />
          )}
        />
      </div>
    </div>
  );
};
