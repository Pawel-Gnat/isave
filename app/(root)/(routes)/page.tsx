import { redirect } from 'next/navigation';

import getCurrentUser from '@/actions/getCurrentUser';

import { Heading } from '@/components/shared/heading';

const HomePage = async () => {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/auth');
  }

  return (
    <>
      <Heading text="Statystyki" />
    </>
  );
};

export default HomePage;
