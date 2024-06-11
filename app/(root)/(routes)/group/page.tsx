import { redirect } from 'next/navigation';

import getCurrentUser from '@/actions/getCurrentUser';

import { SharedBudgets } from './components/shared-budgets';

const GroupPage = async () => {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/auth');
  }

  return (
    <>
      <SharedBudgets />
    </>
  );
};

export default GroupPage;
