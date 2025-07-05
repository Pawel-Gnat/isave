import { redirect } from 'next/navigation';

import getCurrentUser from '@/actions/getCurrentUser';
import getGroupBudgetById from '@/actions/getGroupBudgetById';

import { GroupBudget } from '@prisma/client';
import ClientSharedBudgetPage from './components/client-page';

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
    <ClientSharedBudgetPage
      id={params.id}
      userId={user.id}
      currentBudget={currentBudget}
    />
  );
};

export default SharedBudgetPage;
