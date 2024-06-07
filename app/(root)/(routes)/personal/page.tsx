import { redirect } from 'next/navigation';

import getCurrentUser from '@/actions/getCurrentUser';

import { TransactionsProvider } from '@/context/transactions-context';
import { EditTransactionModalProvider } from '@/context/edit-transaction-modal-context';

import { NewTransactionExpenseModal } from '@/components/transaction-modal/new-transaction-expense-modal';
import { EditTransaction } from '@/components/transaction-modal/edit-transaction';
import { AddIncome } from '@/components/transaction-modal/add-income';

import { ActionsPanel } from './components/actions-panel';
import { Transactions } from './components/transactions';

const PersonalPage = async () => {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/auth');
  }

  return (
    <TransactionsProvider>
      <EditTransactionModalProvider>
        <ActionsPanel />
        <Transactions />
        <NewTransactionExpenseModal />
        <EditTransaction />
        <AddIncome />
      </EditTransactionModalProvider>
    </TransactionsProvider>
  );
};

export default PersonalPage;
