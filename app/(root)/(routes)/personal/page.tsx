import { redirect } from 'next/navigation';

import getCurrentUser from '@/actions/getCurrentUser';

import { TransactionCategoryProvider } from '@/context/transaction-category-context';
import { TransactionModalProvider } from '@/context/transaction-modal-context';
import { EditTransactionModalProvider } from '@/context/edit-transaction-modal-context';

import { NewTransactionExpenseModal } from '@/components/transaction-modal/new-transaction-expense-modal';
import { EditTransactionModal } from '@/components/transaction-modal/modal/edit-transaction-modal';

import { ActionsPanel } from './components/actions-panel';
import { Transactions } from './components/transactions';

const PersonalPage = async () => {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/auth');
  }

  return (
    <TransactionCategoryProvider>
      <EditTransactionModalProvider>
        <TransactionModalProvider>
          {/* <h2 className="text-4xl font-bold">Personal</h2> */}
          <ActionsPanel />
          <Transactions />
          <NewTransactionExpenseModal />
          <EditTransactionModal />
          
        </TransactionModalProvider>
      </EditTransactionModalProvider>
    </TransactionCategoryProvider>
  );
};

export default PersonalPage;
