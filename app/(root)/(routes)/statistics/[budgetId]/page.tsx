import { redirect } from 'next/navigation';

import getCurrentUser from '@/actions/getCurrentUser';

import { Heading } from '@/components/shared/heading';

import { ChartsContainer } from './components/charts-container';

interface GroupBudgetStatisticsProps {
  params: { budgetId: string };
}

const GroupBudgetStatistics = async ({ params }: GroupBudgetStatisticsProps) => {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/auth');
  }

  return (
    <>
      <Heading text="Statystyki transakcji grupowych" />
      <ChartsContainer budgetId={params.budgetId} />
    </>
  );
};

export default GroupBudgetStatistics;
