'use client';

import { endOfMonth, startOfMonth } from 'date-fns';

import useExpenseCategories from '@/hooks/useExpenseCategories';
import usePersonalExpenses from '@/hooks/usePersonalExpenses';
import usePersonalIncomes from '@/hooks/usePersonalIncomes';
import useIncomeCategories from '@/hooks/useIncomeCategories';

import { BarChart } from '@/components/charts/bar-chart';

import { Chart } from './chart';

export const ChartsContainer = () => {
  const { personalExpenses, isPersonalExpensesLoading } = usePersonalExpenses(
    startOfMonth(new Date()),
    endOfMonth(new Date()),
  );
  const { personalIncomes, isPersonalIncomesLoading } = usePersonalIncomes(
    startOfMonth(new Date()),
    endOfMonth(new Date()),
  );
  const { expenseCategories, isExpenseCategoriesLoading } = useExpenseCategories();
  const { incomeCategories, isIncomeCategoriesLoading } = useIncomeCategories();

  return (
    <div className="flex grow flex-col gap-4">
      <Chart
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
      />
    </div>
  );
};
