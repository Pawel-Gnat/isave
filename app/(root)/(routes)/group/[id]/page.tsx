import { redirect } from 'next/navigation';

import getCurrentUser from '@/actions/getCurrentUser';
import getGroupBudgetById from '@/actions/getGroupBudgetById';

import { ActionsPanel } from '@/components/shared/actions-panel';
import { Heading } from '@/components/shared/heading';

import { Transactions } from './components/transactions';

import { GroupBudget } from '@prisma/client';

interface SharedBudgetPageProps {
  id: string;
}

const SharedBudgetPage = async ({ params }: { params: SharedBudgetPageProps }) => {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/auth');
  }

  const currentBudget = (await getGroupBudgetById(params.id)) as GroupBudget;

  if (!currentBudget) {
    redirect('/group');
  }

  return (
    <>
      <Heading text={currentBudget.name} />
      <ActionsPanel id={params.id} category="group" />
      <Transactions id={params.id} userId={user.id} />
    </>
  );
};

export default SharedBudgetPage;
