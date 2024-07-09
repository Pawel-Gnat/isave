import { redirect } from 'next/navigation';

import getCurrentUser from '@/actions/getCurrentUser';

import { Heading } from '@/components/shared/heading';

import { TransactionsList } from './components/transactions-list';

const HomePage = async () => {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/auth');
  }

  return (
    <>
      <Heading text="Statystyki wydatków własnych" />
      <TransactionsList />
    </>
  );
};

export default HomePage;
