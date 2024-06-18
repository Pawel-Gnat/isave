'use client';

import { FC, useContext } from 'react';
import Image from 'next/image';
import { endOfMonth, startOfMonth } from 'date-fns';

import useGroupExpenses from '@/hooks/useGroupExpenses';
import useGroupIncomes from '@/hooks/useGroupIncomes';

import { TransactionsContext } from '@/contexts/transactions-context';

import { Skeleton } from '@/components/ui/skeleton';

import { columns } from './table-columns';
import { TransactionTable } from './transaction-table';

interface TransactionsProps {
  id: string;
}

export const Transactions: FC<TransactionsProps> = ({ id }) => {
  const { date } = useContext(TransactionsContext);

  const { groupExpenses, isGroupExpensesLoading } = useGroupExpenses(
    date?.from || startOfMonth(new Date()),
    date?.to || endOfMonth(new Date()),
    id,
  );
  const { groupIncomes, isGroupIncomesLoading } = useGroupIncomes(
    date?.from || startOfMonth(new Date()),
    date?.to || endOfMonth(new Date()),
    id,
  );

  if (isGroupExpensesLoading || isGroupIncomesLoading) {
    return <Skeleton className="h-80 w-full" />;
  }

  return (
    <div className="flex flex-1 flex-col">
      {groupExpenses &&
      groupIncomes &&
      (groupExpenses.length > 0 || groupIncomes.length > 0) ? (
        <TransactionTable columns={columns} data={[...groupExpenses, ...groupIncomes]} />

      ) : (
        <div className="m-auto text-center">
          <Image
            src="/empty.png"
            alt="Brak transakcji"
            width={300}
            height={300}
            className="aspect-square"
          />
          <p className="font-medium">Brak transakcji dla wybranego okresu</p>
        </div>
      )}
    </div>
  );
};
