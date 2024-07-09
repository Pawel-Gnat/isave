'use client';

import { endOfMonth, startOfMonth } from 'date-fns';

import usePersonalStatistics from '@/hooks/usePersonalStatistics';
import useExpenseCategories from '@/hooks/useExpenseCategories';

import { BarChart } from '@/components/charts/bar-chart';

import { ChartConfig } from '@/components/ui/chart';

interface GroupedTransactions {
  [key: string]: number;
}

export const TransactionsList = () => {
  const { personalStatistics, isPersonalStatisticsLoading } = usePersonalStatistics(
    startOfMonth(new Date()),
    endOfMonth(new Date()),
  );
  const { expenseCategories } = useExpenseCategories();

  const transactions = personalStatistics
    ? personalStatistics.flatMap((stat) => stat.transactions)
    : [];

  const groupedTransactions = transactions.reduce<GroupedTransactions>(
    (acc, transaction) => {
      const { categoryId, value } = transaction;
      if (!acc[categoryId]) {
        acc[categoryId] = 0;
      }
      acc[categoryId] += value;
      return acc;
    },
    {},
  );

  const getExpenseCategoryName = (categoryId: string) => {
    const category = expenseCategories?.find((c) => c.id === categoryId);
    return category ? category.name : 'Brak kategorii';
  };

  const createChartData = (groupedTransactions: { [key: string]: number }) => {
    return Object.entries(groupedTransactions).map(([categoryId, value]) => ({
      categoryName: getExpenseCategoryName(categoryId),
      value: +(value / 100).toFixed(2),
    }));
  };

  const chartData = createChartData(groupedTransactions);

  const chartConfig = {
    desktop: {
      label: 'Value',
      color: 'hsl(var(--chart-1))',
    },
  } satisfies ChartConfig;

  if (isPersonalStatisticsLoading || !chartData) {
    return <div>Ładowanie...</div>;
  }

  return (
    <>
      <BarChart
        chartData={chartData}
        chartConfig={chartConfig}
        title="Zestawienie wydatków"
        description="Wykres przedstawia kategorie wydatków z ich kosztem sumarycznym"
      />
      {/* <ul>
        {chartData.length > 0 ? (
          chartData.map(({ categoryName, value }, index) => (
            <li key={index}>
              {categoryName}: {value} zł
            </li>
          ))
        ) : (
          <li>Brak transakcji w wybranym okresie</li>
        )}
      </ul> */}
    </>
  );
};
