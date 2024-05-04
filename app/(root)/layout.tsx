import { redirect } from 'next/navigation';

import getCurrentUser from '@/actions/getCurrentUser';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/auth');
  }

  return (
    <div className="flex h-screen w-full flex-col overflow-y-auto bg-foreground">
      <main className="flex-1 p-12">{children}</main>
    </div>
  );
}
