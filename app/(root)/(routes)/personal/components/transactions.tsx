'use client';

import { FC } from 'react';
import Image from 'next/image';

import usePersonalExpenses from '@/hooks/usePersonalExpenses';
import usePersonalIncomes from '@/hooks/usePersonalIncomes';

import { columns } from './table-columns';
import { TransactionTable } from './transaction-table';

interface TransactionsProps {
  dateFrom: Date;
  dateTo: Date;
}

export const Transactions: FC<TransactionsProps> = ({ dateFrom, dateTo }) => {
  const { personalExpenses, isPersonalExpensesLoading } = usePersonalExpenses(
    dateFrom,
    dateTo,
  );
  const { personalIncomes, isPersonalIncomesLoading } = usePersonalIncomes(
    dateFrom,
    dateTo,
  );

  if (isPersonalExpensesLoading || isPersonalIncomesLoading) {
    return <p>Ładowanie</p>;
  }

  return (
    <div className="flex flex-1 flex-col">
      {personalExpenses && personalIncomes ? (
        <TransactionTable
          columns={columns}
          data={[...personalExpenses, ...personalIncomes]}
        />
      ) : (
        <div className="m-auto text-center">
          <Image
            src="/empty.png"
            alt=""
            width={300}
            height={300}
            className="aspect-square"
          />
          <p className="font-medium">Brak transakcji dla wybranego miesiąca</p>
        </div>
      )}
    </div>
  );
};
