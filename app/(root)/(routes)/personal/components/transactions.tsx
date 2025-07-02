import Image from 'next/image';
import { endOfMonth, startOfMonth } from 'date-fns';

import { Skeleton } from '@/components/ui/skeleton';
import { TransactionTable } from '@/components/table/transaction-table';

import { columns } from './table-columns';
import usePersonalBudget from '@/hooks/usePersonalBudget';
import { useUrlSearchParams } from '@/hooks/useUrlSearchParams';
import { TransactionType } from '@/types/types';

interface TransactionsProps {
  onEditTransaction: (transactionId: string, transactionType: TransactionType) => void;
  onDeleteTransaction: (transactionId: string, transactionType: TransactionType) => void;
}

export const Transactions = ({
  onEditTransaction,
  onDeleteTransaction,
}: TransactionsProps) => {
  const [searchParams] = useUrlSearchParams();

  const { personalBudget, isPersonalBudgetLoading } = usePersonalBudget(
    new Date(searchParams.get('from') || startOfMonth(new Date())),
    new Date(searchParams.get('to') || endOfMonth(new Date())),
  );

  if (isPersonalBudgetLoading) {
    return <Skeleton className="h-80 w-full" />;
  }

  return (
    <div className="flex flex-1 flex-col">
      {personalBudget &&
      (personalBudget.expenses.length > 0 || personalBudget.incomes.length > 0) ? (
        <TransactionTable
          columns={columns(onEditTransaction, onDeleteTransaction)}
          data={[...personalBudget.expenses, ...personalBudget.incomes]}
        />
      ) : (
        <div className="m-auto text-center">
          <Image
            src="/empty.png"
            alt="Brak transakcji"
            width={200}
            height={200}
            className="mx-auto h-5/6 max-h-72 w-auto"
          />
          <p className="font-medium">Brak transakcji dla wybranego okresu</p>
        </div>
      )}
    </div>
  );
};
