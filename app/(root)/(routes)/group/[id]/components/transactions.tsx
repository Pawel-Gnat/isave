'use client';

import { useContext, useEffect } from 'react';
import Image from 'next/image';
import { endOfMonth, startOfMonth } from 'date-fns';

import useGroupExpenses from '@/hooks/useGroupExpenses';
import useGroupIncomes from '@/hooks/useGroupIncomes';

import { TransactionsContext } from '@/contexts/transactions-context';

import { Skeleton } from '@/components/ui/skeleton';
import { TransactionTable } from '@/components/table/transaction-table';

import { columns } from './table-columns';
import { useUrlSearchParams } from '@/hooks/useUrlSearchParams';

interface TransactionsProps {
  id: string;
  userId: string;
}

export const Transactions = ({ id, userId }: TransactionsProps) => {
  const [searchParams] = useUrlSearchParams();
  const { setUserId } = useContext(TransactionsContext);

  useEffect(() => {
    setUserId(userId);
  }, [userId]);

  const { groupExpenses, isGroupExpensesLoading } = useGroupExpenses(
    new Date(searchParams.get('from') || startOfMonth(new Date())),
    new Date(searchParams.get('to') || endOfMonth(new Date())),
    id,
  );
  const { groupIncomes, isGroupIncomesLoading } = useGroupIncomes(
    new Date(searchParams.get('from') || startOfMonth(new Date())),
    new Date(searchParams.get('to') || endOfMonth(new Date())),
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
