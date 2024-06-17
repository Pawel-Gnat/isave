import { redirect } from 'next/navigation';

import getCurrentUser from '@/actions/getCurrentUser';

import { ActionsPanel } from '@/components/shared/actions-panel';

import { Transactions } from './components/transactions';

interface SharedBudgetPageProps {
  id: string;
}

const SharedBudgetPage = async ({ params }: { params: SharedBudgetPageProps }) => {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/auth');
  }

  return (
    <>
      <ActionsPanel id={params.id} category="group" />
      <Transactions id={params.id} />
    </>
  );
};

export default SharedBudgetPage;
