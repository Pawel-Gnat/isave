'use client';

import Link from 'next/link';
import Image from 'next/image';
import { signOut } from 'next-auth/react';

import Logo from '@/public/logo.svg';

import { Button } from '@/components/ui/button';

import NavLink from './nav-link';

import { AreaChart, Coins, PiggyBank, Power } from 'lucide-react';

const PAGES = [
  { src: '/', label: 'Podsumowanie', icon: <AreaChart className="mr-2" /> },
  {
    src: '/personal',
    label: 'Transakcje osobiste',
    icon: <PiggyBank className="mr-2" />,
  },
  {
    src: '/group',
    label: 'Transakcje grupowe',
    icon: <Coins className="mr-2" />,
  },
];

const Navbar = () => {
  return (
    <nav className="sticky flex h-screen flex-col items-center gap-4 p-6">
      <Link href="/" className="hidden p-2 lg:block">
        {/* <Image
          src={Logo}
          alt=""
          aria-hidden="true"
          width={30}
          height={30}
          className="min-w-[30px]"
        /> */}
        iSave
      </Link>

      <ul className="mt-16 flex flex-col gap-4 text-left">
        {PAGES.map((page) => (
          <li key={page.label}>
            <NavLink href={page.src} label={page.label} icon={page.icon} />
          </li>
        ))}
      </ul>

      <Button className="mt-auto w-full" onClick={() => signOut()} size="lg">
        <Power size={20} className="mr-2" /> Wyloguj się
      </Button>
    </nav>
  );
};

export default Navbar;
