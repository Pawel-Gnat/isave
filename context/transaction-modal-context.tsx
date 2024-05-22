'use client';

import { ReactNode, createContext, useEffect, useState } from 'react';

import getExpenseCategories from '@/actions/getExpenseCategories';

import { ExpenseCategory } from '@prisma/client';

interface TransactionModalContextProps {
  showTransationModal: boolean;
  setShowTransationModal: (show: boolean) => void;
  isLoading: boolean;
  setIsLoading: (value: boolean) => void;
  expenseCategories: ExpenseCategory[];
}

export const TransactionModalContext = createContext<TransactionModalContextProps>({
  showTransationModal: false,
  setShowTransationModal: (show: boolean) => {},
  isLoading: false,
  setIsLoading: (value: boolean) => {},
  expenseCategories: [],
});

export const TransactionModalProvider = ({ children }: { children: ReactNode }) => {
  const [showTransationModal, setShowTransationModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [expenseCategories, setExpenseCategories] = useState<ExpenseCategory[]>([]);

  useEffect(() => {
    (async () => {
      const expenseCategories = await getExpenseCategories();
      setExpenseCategories(expenseCategories);
    })();
  }, []);

  return (
    <TransactionModalContext.Provider
      value={{
        showTransationModal,
        setShowTransationModal,
        isLoading,
        setIsLoading,
        expenseCategories,
      }}
    >
      {children}
    </TransactionModalContext.Provider>
  );
};
