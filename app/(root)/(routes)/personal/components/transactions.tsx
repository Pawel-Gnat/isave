'use client';

import { useContext } from 'react';
import Image from 'next/image';
import { endOfMonth, startOfMonth } from 'date-fns';

import usePersonalExpenses from '@/hooks/usePersonalExpenses';
import usePersonalIncomes from '@/hooks/usePersonalIncomes';

import { TransactionsContext } from '@/contexts/transactions-context';

import { Skeleton } from '@/components/ui/skeleton';

import { columns } from './table-columns';
import { TransactionTable } from './transaction-table';

export const Transactions = () => {
  const { date } = useContext(TransactionsContext);

  const { personalExpenses, isPersonalExpensesLoading } = usePersonalExpenses(
    date?.from || startOfMonth(new Date()),
    date?.to || endOfMonth(new Date()),
  );
  const { personalIncomes, isPersonalIncomesLoading } = usePersonalIncomes(
    date?.from || startOfMonth(new Date()),
    date?.to || endOfMonth(new Date()),
  );

  if (isPersonalExpensesLoading || isPersonalIncomesLoading) {
    return <Skeleton className="h-80 w-full" />;
  }

  return (
    <div className="flex flex-1 flex-col">
      {personalExpenses &&
      personalIncomes &&
      (personalExpenses.length > 0 || personalIncomes.length > 0) ? (
        <TransactionTable
          columns={columns}
          data={[...personalExpenses, ...personalIncomes]}
        />
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
