import { redirect } from 'next/navigation';
import { format } from 'date-fns';

import getCurrentUser from '@/actions/getCurrentUser';

import { TransactionModalProvider } from '@/context/transaction-modal-context';

import { TransactionModal } from '@/components/transaction-modal/transaction-modal';

import { TransactionTable } from './components/transaction-table';
import { columns } from './components/table-columns';
import { ActionsPanel } from './components/actions-panel';

import { Transactions } from './components/transactions';

const PersonalPage = async () => {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/auth');
  }

  return (
    <TransactionModalProvider>
      {/* <h2 className="text-4xl font-bold">Personal</h2> */}
      <ActionsPanel />
      <Transactions />
      <TransactionModal />
    </TransactionModalProvider>
  );
};

export default PersonalPage;
