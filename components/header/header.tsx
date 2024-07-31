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
    <header className="absolute left-0 top-0 flex w-fit items-center p-4 sm:left-auto sm:right-0 sm:top-auto sm:justify-end sm:p-6">
      <NotificationContainer userId={user.id} />
      <Badge variant="outline" className="ml-4 hidden px-4 py-2 text-base sm:block">
        <span className="">{user.name}</span>
      </Badge>
    </header>
  );
};

export default Header;
