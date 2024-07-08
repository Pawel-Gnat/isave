import { redirect } from 'next/navigation';
import { endOfMonth, startOfMonth } from 'date-fns';

import getCurrentUser from '@/actions/getCurrentUser';
import getPersonalStatistics from '@/actions/getPersonalStatistics';

import { Heading } from '@/components/shared/heading';

import { TransactionsList } from './components/transactions-list';

const HomePage = async () => {
  const user = await getCurrentUser();
  // const stats = await getPersonalStatistics({
  //   from: startOfMonth(new Date()),
  //   to: endOfMonth(new Date()),
  // });

  if (!user) {
    redirect('/auth');
  }
  // console.log(stats);


  // console.log(transactions);

  return (
    <>
      <Heading text="Statystyki wydatków własnych" />
   <TransactionsList />
    </>
  );
};

export default HomePage;
