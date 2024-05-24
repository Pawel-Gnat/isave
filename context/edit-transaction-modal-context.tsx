'use client';

import { ReactNode, createContext, useEffect, useState } from 'react';

import getPersonalExpenseById from '@/actions/getPersonalExpenseById';
import getPersonalIncomeById from '@/actions/getPersonalIncomeById';

import { PersonalExpenses, PersonalIncomes } from '@prisma/client';
import { TransactionType } from '@/types/types';

interface EditTransactionModalContextProps {
  showEditTransactionModal: boolean;
  setShowEditTransactionModal: (show: boolean) => void;
  isLoading: boolean;
  setIsLoading: (value: boolean) => void;
  transactionId: string;
  setTransactionId: (value: string) => void;
  transactionType: TransactionType;
  setTransactionType: (value: TransactionType) => void;
}

export const EditTransactionModalContext =
  createContext<EditTransactionModalContextProps>({
    showEditTransactionModal: false,
    setShowEditTransactionModal: (show: boolean) => {},
    isLoading: false,
    setIsLoading: (value: boolean) => {},
    transactionId: '',
    setTransactionId: (value: string) => {},
    transactionType: null,
    setTransactionType: (value: TransactionType) => {},
  });

export const EditTransactionModalProvider = ({ children }: { children: ReactNode }) => {
  const [showEditTransactionModal, setShowEditTransactionModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [transactionId, setTransactionId] = useState('');
  const [transactionType, setTransactionType] = useState<TransactionType>(null);
  const [transactions, setTransactions] = useState<PersonalIncomes | PersonalExpenses>();
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    (async () => {
      if (!transactionId || !transactionType) return;

      if (transactionType === 'income') {
        const transaction = await getPersonalIncomeById(transactionId);
        if (!transaction) return;

        setTransactions(transaction);
        setDate(new Date(transaction.date));
      }

      if (transactionType === 'expense') {
        const transaction = await getPersonalExpenseById(transactionId);
        if (!transaction) return;

        setTransactions(transaction);
      }
    })();
  }, [transactionId, transactionType]);

  return (
    <EditTransactionModalContext.Provider
      value={{
        showEditTransactionModal,
        setShowEditTransactionModal,
        isLoading,
        setIsLoading,
        transactionId,
        setTransactionId,
        transactionType,
        setTransactionType,
      }}
    >
      {children}
    </EditTransactionModalContext.Provider>
  );
};
