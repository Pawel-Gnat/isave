import { redirect } from 'next/navigation';

import getCurrentUser from '@/actions/getCurrentUser';

import { ActionsPanel } from './components/actions-panel';
import { Transactions } from './components/transactions';

const PersonalPage = async () => {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/auth');
  }

  return (
    <>
      <ActionsPanel />
      <Transactions />
    </>
  );
};

export default PersonalPage;
