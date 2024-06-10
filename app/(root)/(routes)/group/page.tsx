import { redirect } from 'next/navigation';

import getCurrentUser from '@/actions/getCurrentUser';

const GroupPage = async () => {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/auth');
  }

  return (
    <>
      <h2 className="text-4xl font-bold">Group</h2>
    </>
  );
};

export default GroupPage;
