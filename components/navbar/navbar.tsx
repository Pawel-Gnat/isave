'use client';

import Link from 'next/link';
import Image from 'next/image';
import { signOut } from 'next-auth/react';

import { Button } from '@/components/ui/button';

import NavLink from './nav-link';

import { AreaChart, Coins, PiggyBank, Power, Settings } from 'lucide-react';

const PAGES = [
  { src: '/', label: 'Statystyki', icon: <AreaChart className="lg:mr-2" /> },
  {
    src: '/personal',
    label: 'Transakcje osobiste',
    icon: <PiggyBank className="lg:mr-2" />,
  },
  {
    src: '/group',
    label: 'Transakcje grupowe',
    icon: <Coins className="lg:mr-2" />,
  },
  {
    src: '/settings',
    label: 'Ustawienia',
    icon: <Settings className="lg:mr-2" />,
  },
];

const Navbar = () => {
  return (
    <nav className="flex flex-row items-center justify-end gap-2 p-4 sm:sticky sm:h-screen sm:flex-col sm:gap-4 sm:p-6">
      <Link
        href="/"
        className="mr-auto hidden font-bold text-primary sm:mr-0 sm:block sm:pb-2 sm:text-5xl"
      >
        <Image src="/isave.svg" alt="iSave" width={60} height={60} />
      </Link>

      <ul className="flex flex-row gap-2 text-left sm:mt-16 sm:flex-col sm:gap-4">
        {PAGES.map((page) => (
          <li key={page.label}>
            <NavLink href={page.src} label={page.label} icon={page.icon} />
          </li>
        ))}
      </ul>

      <Button
        className="p-2 text-base sm:mt-auto sm:w-full sm:p-4 lg:px-8"
        onClick={() => signOut()}
        size="lg"
      >
        <Power size={24} className="lg:mr-2" />
        <span className="hidden w-fit text-nowrap lg:block"> Wyloguj się</span>
      </Button>
    </nav>
  );
};

export default Navbar;
