import { redirect } from 'next/navigation';
import { endOfMonth, startOfMonth } from 'date-fns';

import getCurrentUser from '@/actions/getCurrentUser';

import { TransactionsProvider } from '@/context/transactions-context';
import { TransactionModalProvider } from '@/context/transaction-modal-context';
import { EditTransactionModalProvider } from '@/context/edit-transaction-modal-context';
import { IncomeModalProvider } from '@/context/income-modal-context';

import { NewTransactionExpenseModal } from '@/components/transaction-modal/new-transaction-expense-modal';
import { EditTransaction } from '@/components/transaction-modal/edit-transaction';
import { AddIncome } from '@/components/transaction-modal/add-income';

import { ActionsPanel } from './components/actions-panel';
import { Transactions } from './components/transactions';

interface PersonalPageProps {
  from: string;
  to: string;
}

const PersonalPage = async ({ searchParams }: { searchParams: PersonalPageProps }) => {
  const { from, to } = searchParams;
  const user = await getCurrentUser();
  const dateFrom = from ? new Date(from) : startOfMonth(new Date());
  const dateTo = to ? new Date(to) : endOfMonth(new Date());

  if (!user) {
    redirect('/auth');
  }

  return (
    <TransactionsProvider>
      <EditTransactionModalProvider>
        <TransactionModalProvider>
          <IncomeModalProvider>
            <ActionsPanel dateFrom={dateFrom} dateTo={dateTo} />
            <Transactions dateFrom={dateFrom} dateTo={dateTo} />
            <NewTransactionExpenseModal />
            <EditTransaction />
            <AddIncome />
          </IncomeModalProvider>
        </TransactionModalProvider>
      </EditTransactionModalProvider>
    </TransactionsProvider>
  );
};

export default PersonalPage;
