'use client';

import Link from 'next/link';

// import Avatar from '../avatar/avatar';

import { User } from '@prisma/client';

interface HeaderProps {
  user: User;
}

const Header: React.FC<HeaderProps> = ({ user }) => {
  return (
    <header className="sticky top-0 z-10 ml-1 flex items-center justify-between rounded-bl-lg bg-background p-6">
      {/* <h1 className="text-3xl font-bold">{company?.name}</h1> */}

      <Link href="/settings">
        <div className="flex flex-row gap-4">
          {/* {user?.name && (
            <Avatar image={user?.image} name={user?.name} surname={user?.surname} />
          )} */}
          <div className="text-left">
            <span className="hidden font-bold md:block">
              {user?.name && `${user?.name}`}
            </span>
            <span className="hidden md:block">{user?.email && `${user?.email}`}</span>
          </div>
        </div>
      </Link>
    </header>
  );
};

export default Header;
