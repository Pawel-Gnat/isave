import { redirect } from 'next/navigation';

import getCurrentUser from '@/actions/getCurrentUser';

import { ActionsPanel } from '@/components/shared/actions-panel';

const SharedBudgetPage = async () => {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/auth');
  }

  return (
    <>
      <ActionsPanel />
    </>
  );
};

export default SharedBudgetPage;
