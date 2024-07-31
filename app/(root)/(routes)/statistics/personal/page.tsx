import { redirect } from 'next/navigation';

import getCurrentUser from '@/actions/getCurrentUser';

import { Heading } from '@/components/shared/heading';

import { ChartsContainer } from './components/charts-container';

const PersonalBudgetStatistics = async () => {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/auth');
  }

  return (
    <>
      <Heading text="Statystyki własne" />
      <ChartsContainer />
    </>
  );
};

export default PersonalBudgetStatistics;
