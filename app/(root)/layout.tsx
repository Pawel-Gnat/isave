import QueryProvider from '@/contexts/query-context';
import { AlertProvider } from '@/contexts/alert-context';
import { TransactionsProvider } from '@/contexts/transactions-context';

import Navbar from '@/components/navbar/navbar';
import Header from '@/components/header/header';

import { DeleteTransaction } from '@/components/dialog/delete-transaction';
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
          <div className="relative flex h-screen w-full flex-col overflow-y-auto">
            <Header />
            <main className="flex flex-1 flex-col px-12 py-6">{children}</main>
            <EditTransaction />
            <AddExpense />
            <AddIncome />
            <DeleteTransaction />
          </div>
        </AlertProvider>
      </TransactionsProvider>
    </QueryProvider>
  );
}
