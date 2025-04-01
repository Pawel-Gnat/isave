import { MemberDialog } from '@/components/dialog/members-dialog';
import { NewBudget } from '@/components/dialog/new-budget';

import { Heading } from '@/components/shared/heading';

import { SharedBudgets } from './components/shared-budgets';
import { BudgetsPanel } from './components/budgets-panel';
import { auth } from '@/lib/auth';

const GroupPage = async () => {
  const session = await auth();

  return (
    <>
      <Heading text="Transakcje grupowe" />
      <BudgetsPanel />
      <SharedBudgets userId={session?.user?.id} />
      <NewBudget />
      <MemberDialog />
    </>
  );
};

export default GroupPage;
