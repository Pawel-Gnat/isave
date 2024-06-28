import { redirect } from 'next/navigation';

import getCurrentUser from '@/actions/getCurrentUser';

import { Heading } from '@/components/shared/heading';

import { PersonalExpensesCard } from './components/personal-expenses-card';
import { PersonalIncomesCard } from './components/personal-incomes-card';
import { GroupBudgetsContainer } from './components/group-budgets-container';

const HomePage = async () => {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/auth');
  }

  return (
    <>
      <Heading text="Statystyki" />
      <div className="flex flex-row gap-4">
        <PersonalExpensesCard />
        <PersonalIncomesCard />
      </div>
      <GroupBudgetsContainer />
    </>
  );
};

export default HomePage;
