import { redirect } from 'next/navigation';

import getCurrentUser from '@/actions/getCurrentUser';

import { MemberDialog } from '@/components/dialog/members-dialog';
import { NewBudget } from '@/components/dialog/new-budget';

import { Heading } from '@/components/shared/heading';

import { SharedBudgets } from './components/shared-budgets';
import { BudgetsPanel } from './components/budgets-panel';

const GroupPage = async () => {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/auth');
  }

  return (
    <>
      <Heading text="Transakcje grupowe" />
      <BudgetsPanel />
      <SharedBudgets userId={user.id} />
      <NewBudget />
      <MemberDialog />
    </>
  );
};

export default GroupPage;
