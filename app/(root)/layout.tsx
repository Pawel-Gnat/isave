import QueryProvider from '@/contexts/query-context';
import { AlertProvider } from '@/contexts/alert-context';
import { TransactionsProvider } from '@/contexts/transactions-context';

import Navbar from '@/components/shared/navbar';
import Header from '@/components/shared/header';
import { Alert } from '@/components/shared/alert';

import { EditTransaction } from '@/components/transaction-modal/edit-transaction';
import { AddExpense } from '@/components/transaction-modal/add-expense';
import { AddIncome } from '@/components/transaction-modal/add-income';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QueryProvider>
      <TransactionsProvider>
        <AlertProvider>
          <Navbar />
          {/* <div className="flex h-screen w-full flex-col overflow-y-auto bg-foreground"> */}
          <div className="flex h-screen w-full flex-col overflow-y-auto">
            <Header />
            <main className="flex flex-1 flex-col p-12">{children}</main>
            <EditTransaction />
            <AddExpense />
            <AddIncome />
            <Alert />
          </div>
        </AlertProvider>
      </TransactionsProvider>
    </QueryProvider>
  );
}
