import { redirect } from 'next/navigation';

import getCurrentUser from '@/actions/getCurrentUser';

import { NotificationContainer } from '../shared/notification-container';

import { Badge } from '@/components/ui/badge';

const Header = async () => {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/auth');
  }
  return (
    <header className="absolute left-0 right-0 flex items-center justify-end px-12 py-6">
      <NotificationContainer userId={user.id} />
      <Badge variant="outline" className="ml-4 px-4 py-2 text-base">
        <span className="">{user.name}</span>
      </Badge>
    </header>
  );
};

export default Header;
