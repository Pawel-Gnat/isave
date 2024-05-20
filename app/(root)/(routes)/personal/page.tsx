import { redirect } from 'next/navigation';
import { format } from 'date-fns';

import getCurrentUser from '@/actions/getCurrentUser';

import { TransactionModalProvider } from '@/context/transaction-modal-context';

import { TransactionModal } from '@/components/transaction-modal/transaction-modal';

import { TransactionTable } from './components/transaction-table';
import { columns } from './components/table-columns';
import { ActionsPanel } from './components/actions-panel';

import { PersonalExpenses, PersonalIncomes } from '@prisma/client';

async function getData(): Promise<PersonalIncomes[] | PersonalExpenses[]> {
  return [
    {
      name: 'Zakupy',
      date: format(new Date(), 'yyyy-MM-dd'),
      value: 200,
    },
    {
      name: 'Zakupy',
      date: format(new Date(), 'yyyy-MM-dd'),
      value: 200,
    },
    {
      name: 'Zakupy',
      date: format(new Date(), 'yyyy-MM-dd'),
      value: 200,
    },
    {
      name: 'Zakupy',
      date: format(new Date(), 'yyyy-MM-dd'),
      value: 200,
    },
    {
      name: 'Zakupy',
      date: format(new Date(), 'yyyy-MM-dd'),
      value: 200,
    },
    {
      name: 'Zakupy',
      date: format(new Date(), 'yyyy-MM-dd'),
      value: 200,
    },
    {
      name: 'Zakupy',
      date: format(new Date(), 'yyyy-MM-dd'),
      value: 200,
    },
    {
      name: 'Zakupy',
      date: format(new Date(), 'yyyy-MM-dd'),
      value: 200,
    },
    {
      name: 'Zakupy',
      date: format(new Date(), 'yyyy-MM-dd'),
      value: 200,
    },
    {
      name: 'Zakupy',
      date: format(new Date(), 'yyyy-MM-dd'),
      value: 200,
    },
    {
      name: 'Zakupy',
      date: format(new Date(), 'yyyy-MM-dd'),
      value: 200,
    },
  ];
}

const PersonalPage = async () => {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/auth');
  }

  const data = await getData();

  return (
    <TransactionModalProvider>
      {/* <h2 className="text-4xl font-bold">Personal</h2> */}
      <ActionsPanel />
      <TransactionTable columns={columns} data={data} />
      <TransactionModal />
    </TransactionModalProvider>
  );
};

export default PersonalPage;
