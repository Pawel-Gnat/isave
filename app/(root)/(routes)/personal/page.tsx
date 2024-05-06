import { redirect } from 'next/navigation';

import getCurrentUser from '@/actions/getCurrentUser';

const PersonalPage = async () => {
  //   const user = await getCurrentUser();

  //   if (!user) {
  //     redirect('/auth');
  //   }

  return (
    <>
      <h2 className="text-4xl font-bold">Personal</h2>
    </>
  );
};

export default PersonalPage;
