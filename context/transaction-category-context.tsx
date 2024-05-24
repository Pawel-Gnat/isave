'use client';

import { ReactNode, createContext, useEffect, useState } from 'react';

import getExpenseCategories from '@/actions/getExpenseCategories';

import { ExpenseCategory } from '@prisma/client';

interface TransactionCategoryContextProps {
  expenseCategories: ExpenseCategory[];
}

export const TransactionCategoryContext = createContext<TransactionCategoryContextProps>({
  expenseCategories: [],
});

export const TransactionCategoryProvider = ({ children }: { children: ReactNode }) => {
  const [expenseCategories, setExpenseCategories] = useState<ExpenseCategory[]>([]);

  useEffect(() => {
    (async () => {
      const expenseCategories = await getExpenseCategories();
      setExpenseCategories(expenseCategories);
    })();
  }, []);

  return (
    <TransactionCategoryContext.Provider
      value={{
        expenseCategories,
      }}
    >
      {children}
    </TransactionCategoryContext.Provider>
  );
};
