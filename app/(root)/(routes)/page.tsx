import { Heading } from '@/components/shared/heading';

import { GroupContainer } from './components/group-container';
import { PersonalContainer } from './components/personal-container';

const HomePage = async () => {
  return (
    <>
      <Heading text="Statystyki" />
      <PersonalContainer />
      <GroupContainer />
    </>
  );
};

export default HomePage;
