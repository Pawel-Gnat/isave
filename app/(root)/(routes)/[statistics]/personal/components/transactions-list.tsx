'use client';

import { endOfMonth, startOfMonth } from 'date-fns';

import usePersonalStatistics from '@/hooks/usePersonalStatistics';

export const TransactionsList = () => {
  const { personalStatistics } = usePersonalStatistics(
    startOfMonth(new Date()),
    endOfMonth(new Date()),
  );

  const transactions = personalStatistics
    ? personalStatistics.flatMap((stat) => stat.transactions)
    : [];

  const groupedTransactions = transactions.reduce((acc, transaction) => {
    const { categoryId, value } = transaction;
    if (!acc[categoryId]) {
      acc[categoryId] = 0;
    }
    acc[categoryId] += value;
    return acc;
  }, {});

  const groupedTransactionsArray = Object.entries(groupedTransactions).map(
    ([categoryId, totalValue]) => ({
      categoryId,
      totalValue,
    }),
  );

  return (
    <ul>
      {groupedTransactionsArray.length > 0 ? (
        groupedTransactionsArray.map((stat) => (
          <li key={stat.categoryId}>
            {stat.categoryId} - {(stat.totalValue / 100).toFixed(2)}
          </li>
        ))
      ) : (
        <li>Brak transakcji w wybranym okresie</li>
      )}
    </ul>
  );
};
