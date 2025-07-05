import { ReactNode } from 'react';

import QueryProvider from '@/contexts/query-context';
import { AlertProvider } from '@/contexts/alert-context';
import { TransactionsProvider } from '@/contexts/transactions-context';

import Navbar from '@/components/navbar/navbar';
import Header from '@/components/header/header';

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <QueryProvider>
      <TransactionsProvider>
        <AlertProvider>
          <Navbar />
          <div className="flex w-full flex-1 flex-col overflow-y-auto sm:h-screen">
            <Header />
            <main className="flex flex-1 flex-col p-4 sm:p-6 lg:px-12">{children}</main>
          </div>
        </AlertProvider>
      </TransactionsProvider>
    </QueryProvider>
  );
}
