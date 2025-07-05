import { auth } from '@/lib/auth';

import ClientGroupPage from './components/client-page';
import { redirect } from 'next/navigation';

const GroupPage = async () => {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/auth');
  }

  return <ClientGroupPage userId={session.user.id} />;
};

export default GroupPage;
