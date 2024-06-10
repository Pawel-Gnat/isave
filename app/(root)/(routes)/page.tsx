import { redirect } from 'next/navigation';

import getCurrentUser from '@/actions/getCurrentUser';

const HomePage = async () => {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/auth');
  }

  return (
    <>
      <h2 className="text-4xl font-bold">Overview</h2>
    </>
  );
};

export default HomePage;
