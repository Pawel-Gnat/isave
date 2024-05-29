import { redirect } from 'next/navigation';

import getCurrentUser from '@/actions/getCurrentUser';

import { TransactionCategoryProvider } from '@/context/transaction-category-context';
import { TransactionModalProvider } from '@/context/transaction-modal-context';
import { EditTransactionModalProvider } from '@/context/edit-transaction-modal-context';
import { IncomeModalProvider } from '@/context/income-modal-context';

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
    <TransactionCategoryProvider>
      <EditTransactionModalProvider>
        <TransactionModalProvider>
          <IncomeModalProvider>
            {/* <h2 className="text-4xl font-bold">Personal</h2> */}
            <ActionsPanel />
            <Transactions />
            <NewTransactionExpenseModal />
            <EditTransaction />
            <AddIncome />
          </IncomeModalProvider>
        </TransactionModalProvider>
      </EditTransactionModalProvider>
    </TransactionCategoryProvider>
  );
};

export default PersonalPage;
