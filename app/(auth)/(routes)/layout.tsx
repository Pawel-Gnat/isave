import { redirect } from 'next/navigation';

import getCurrentUser from '@/actions/getCurrentUser';
import { ReactNode } from 'react';

export default async function AuthLayout({ children }: { children: ReactNode }) {
  const user = await getCurrentUser();

  if (user) {
    redirect('/');
  }

  return <main className="w-full">{children}</main>;
}
