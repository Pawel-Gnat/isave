import { redirect } from 'next/navigation';
import { endOfMonth, startOfMonth } from 'date-fns';

import getCurrentUser from '@/actions/getCurrentUser';

import { Heading } from '@/components/shared/heading';
import getPersonalStatistics from '@/actions/getPersonalStatistics';

const HomePage = async () => {
  const user = await getCurrentUser();
  const stats = await getPersonalStatistics({
    from: startOfMonth(new Date()),
    to: endOfMonth(new Date()),
  });

  if (!user) {
    redirect('/auth');
  }
  console.log(stats);

  const transactions = stats?.transactions || [];

  return (
    <>
      <Heading text="Statystyki" />
      <ul>
        {transactions.length > 0 ? (
          transactions.map((stat) => <li key={stat.id}>{stat.categoryId}</li>)
        ) : (
          <li>Brak transakcji w tym miesiącu</li>
        )}
      </ul>
    </>
  );
};

export default HomePage;
