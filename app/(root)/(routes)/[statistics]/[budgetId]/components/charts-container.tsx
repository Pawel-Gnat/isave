'use client';

import { useState } from 'react';
import { endOfMonth, startOfMonth } from 'date-fns';

import useExpenseCategories from '@/hooks/useExpenseCategories';
import usePersonalExpenses from '@/hooks/usePersonalExpenses';
import usePersonalIncomes from '@/hooks/usePersonalIncomes';
import useIncomeCategories from '@/hooks/useIncomeCategories';

import { DatePicker } from '@/components/shared/date-picker';
import { BarChart } from '@/components/charts/bar-chart';

// import { Chart } from './chart';

import { DateRange } from 'react-day-picker';
import useGroupExpenses from '@/hooks/useGroupExpenses';
import useGroupExpensesByUserId from '@/hooks/useGroupExpensesByUserId';

interface ChartsContainerProps {
  budgetId: string;
}

export const ChartsContainer = ({ budgetId }: ChartsContainerProps) => {
  const [date, setDate] = useState<DateRange>({
    from: startOfMonth(new Date()),
    to: endOfMonth(new Date()),
  });
  // const { personalExpenses, isPersonalExpensesLoading } = usePersonalExpenses(
  //   date.from || startOfMonth(new Date()),
  //   date.to || endOfMonth(new Date()),
  // );
  // const { personalIncomes, isPersonalIncomesLoading } = usePersonalIncomes(
  //   date.from || startOfMonth(new Date()),
  //   date.to || endOfMonth(new Date()),
  // );

  // const{}=useGroupExpensesByUserId()

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
      {/* <Chart
        title="Zestawienie wydatków"
        description="Wykres przedstawia kategorie wydatków z ich kosztem sumarycznym"
        isLoading={isPersonalExpensesLoading && isExpenseCategoriesLoading}
        categories={expenseCategories}
        transactions={personalExpenses}
        chart={(chartData, chartConfig, title, description) => (
          <BarChart
            chartData={chartData}
            chartConfig={chartConfig}
            title={title}
            description={description}
          />
        )}
      />
      <Chart
        title="Zestawienie przychodów"
        description="Wykres przedstawia kategorie przychodów z ich zyskiem sumarycznym"
        isLoading={isPersonalIncomesLoading && isIncomeCategoriesLoading}
        categories={incomeCategories}
        transactions={personalIncomes}
        chart={(chartData, chartConfig, title, description) => (
          <BarChart
            chartData={chartData}
            chartConfig={chartConfig}
            title={title}
            description={description}
          />
        )}
      /> */}
    </div>
  );
};
