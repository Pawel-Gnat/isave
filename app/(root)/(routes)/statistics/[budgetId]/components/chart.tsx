import { FC, ReactNode } from 'react';

import { createChartData, flatTransactions, groupTransactions } from '@/utils/chartUtils';

import { ChartConfig } from '@/components/ui/chart';
import { Skeleton } from '@/components/ui/skeleton';

import { ModifiedGroupExpense, ModifiedGroupIncome } from '@/types/types';
import { ExpenseCategory, IncomeCategory } from '@prisma/client';

interface ExpenseChartProps {
  title: string;
  description: string;
  isLoading: boolean;
  categories: ExpenseCategory[] | IncomeCategory[] | undefined;
  transactions: ModifiedGroupExpense[] | ModifiedGroupIncome[] | undefined | null;
  chart: (
    chartData: any,
    chartConfig: ChartConfig,
    title: string,
    description: string,
  ) => ReactNode;
}

export const Chart: FC<ExpenseChartProps> = ({
  title,
  description,
  isLoading,
  categories,
  transactions,
  chart,
}) => {
  if (isLoading || !categories || !transactions) {
    return <Skeleton className="h-full max-h-[450px] w-full" />;
  }

  const flattenTransactions = flatTransactions(transactions);
  const groupedTransactions = groupTransactions(flattenTransactions);
  const chartData = createChartData(categories, groupedTransactions);

  const chartConfig = {
    value: {
      label: 'Suma',
      color: 'hsl(var(--chart-1))',
    },
  } satisfies ChartConfig;

  return <>{chart(chartData, chartConfig, title, description)}</>;
};
