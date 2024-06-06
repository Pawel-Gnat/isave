import { redirect } from 'next/navigation';

import getCurrentUser from '@/actions/getCurrentUser';

import { AlertProvider } from '@/context/alert-context';
import QueryProvider from '@/context/query-context';

import Navbar from '@/components/shared/navbar';
import Header from '@/components/shared/header';
import { Alert } from '@/components/shared/alert';

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
    <QueryProvider>
      <AlertProvider>
        <Navbar />
        {/* <div className="flex h-screen w-full flex-col overflow-y-auto bg-foreground"> */}
        <div className="flex h-screen w-full flex-col overflow-y-auto">
          <Header user={user} />
          <main className="flex flex-1 flex-col p-12">{children}</main>
          <Alert />
        </div>
      </AlertProvider>
    </QueryProvider>
  );
}
