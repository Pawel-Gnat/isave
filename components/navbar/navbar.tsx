'use client';

import Link from 'next/link';
import Image from 'next/image';
import { signOut } from 'next-auth/react';

import { Button } from '@/components/ui/button';

import NavLink from './nav-link';

import { AreaChart, Coins, PiggyBank, Power, Settings } from 'lucide-react';

const PAGES = [
  { src: '/', label: 'Statystyki', icon: <AreaChart className="mr-2" /> },
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
  {
    src: '/settings',
    label: 'Ustawienia',
    icon: <Settings className="mr-2" />,
  },
];

const Navbar = () => {
  return (
    <nav className="sticky flex h-screen flex-col items-center gap-4 p-6">
      <Link href="/" className="hidden pb-2 text-5xl font-bold text-primary lg:block">
        <Image src="/isave.svg" alt="iSave" width={60} height={60} />
      </Link>

      <ul className="mt-16 flex flex-col gap-4 text-left">
        {PAGES.map((page) => (
          <li key={page.label}>
            <NavLink href={page.src} label={page.label} icon={page.icon} />
          </li>
        ))}
      </ul>

      <Button className="mt-auto w-full text-base" onClick={() => signOut()} size="lg">
        <Power size={20} className="mr-2" /> Wyloguj się
      </Button>
    </nav>
  );
};

export default Navbar;
