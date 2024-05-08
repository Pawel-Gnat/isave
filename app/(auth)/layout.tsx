import { redirect } from 'next/navigation';

import getCurrentUser from '@/actions/getCurrentUser';

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();

  if (user) {
    redirect('/');
  }

  return <main className="w-full">{children}</main>;
}
