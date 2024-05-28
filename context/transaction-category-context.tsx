'use client';

import { ReactNode, createContext, useEffect, useState } from 'react';

import getExpenseCategories from '@/actions/getExpenseCategories';
import getIncomeCategories from '@/actions/getIncomeCategories';

import { ExpenseCategory, IncomeCategory } from '@prisma/client';

interface TransactionCategoryContextProps {
  expenseCategories: ExpenseCategory[];
  incomeCategories: IncomeCategory[];
}

export const TransactionCategoryContext = createContext<TransactionCategoryContextProps>({
  expenseCategories: [],
  incomeCategories: [],
});

export const TransactionCategoryProvider = ({ children }: { children: ReactNode }) => {
  const [expenseCategories, setExpenseCategories] = useState<ExpenseCategory[]>([]);
  const [incomeCategories, setIncomeCategories] = useState<IncomeCategory[]>([]);

  useEffect(() => {
    (async () => {
      const expenseCategories = await getExpenseCategories();
      const incomeCategories = await getIncomeCategories();
      setExpenseCategories(expenseCategories);
      setIncomeCategories(incomeCategories);
    })();
  }, []);

  return (
    <TransactionCategoryContext.Provider
      value={{
        expenseCategories,
        incomeCategories,
      }}
    >
      {children}
    </TransactionCategoryContext.Provider>
  );
};
