'use client';

import { endOfMonth, startOfMonth } from 'date-fns';

import usePersonalStatistics from '@/hooks/usePersonalStatistics';
import useExpenseCategories from '@/hooks/useExpenseCategories';

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

  if (isPersonalStatisticsLoading) {
    return <div>Ładowanie...</div>;
  }

  return (


    
    <ul>
      {Object.keys(groupedTransactions).length > 0 ? (
        Object.entries(groupedTransactions).map(([categoryId, value]) => (
          <li key={categoryId}>
            {getExpenseCategoryName(categoryId)}: {(value / 100).toFixed(2)} zł
          </li>
        ))
      ) : (
        <li>Brak transakcji w wybranym okresie</li>
      )}
    </ul>
  );
};
