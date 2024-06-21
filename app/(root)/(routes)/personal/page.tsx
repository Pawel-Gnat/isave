import { redirect } from 'next/navigation';

import getCurrentUser from '@/actions/getCurrentUser';

import { ActionsPanel } from '@/components/shared/actions-panel';
import { Heading } from '@/components/shared/heading';

import { Transactions } from './components/transactions';

const PersonalPage = async () => {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/auth');
  }

  return (
    <>
      <Heading text="Transakcje osobiste" />
      <ActionsPanel category="personal" />
      <Transactions />
    </>
  );
};

export default PersonalPage;
