import { redirect } from 'next/navigation';

import getCurrentUser from '@/actions/getCurrentUser';

import { Heading } from '@/components/shared/heading';

import { GroupContainer } from './components/group-container';
import { PersonalContainer } from './components/personal-container';

const HomePage = async () => {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/auth');
  }

  return (
    <>
      <Heading text="Statystyki" />
      <PersonalContainer />
      <GroupContainer />
    </>
  );
};

export default HomePage;
