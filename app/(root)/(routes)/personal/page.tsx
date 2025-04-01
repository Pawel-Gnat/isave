import { ActionsPanel } from '@/components/shared/actions-panel';
import { Heading } from '@/components/shared/heading';

import { Transactions } from './components/transactions';

const PersonalPage = async () => {
  return (
    <>
      <Heading text="Transakcje osobiste" />
      <ActionsPanel category="personal" />
      <Transactions />
    </>
  );
};

export default PersonalPage;
