import { redirect } from 'next/navigation';

import getCurrentUser from '@/actions/getCurrentUser';

import { Heading } from '@/components/shared/heading';

import { GroupBudgetsContainer } from './components/group-budgets-container';
import { PersonalBudgetContainer } from './components/personal-budget-container';

const HomePage = async () => {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/auth');
  }

  return (
    <>
      <Heading text="Statystyki" />
      <PersonalBudgetContainer />
      <GroupBudgetsContainer />
    </>
  );
};

export default HomePage;
