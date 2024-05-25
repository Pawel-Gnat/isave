'use client';

import { ReactNode, createContext, useEffect, useState } from 'react';

import getPersonalExpenseById from '@/actions/getPersonalExpenseById';
import getPersonalIncomeById from '@/actions/getPersonalIncomeById';

import { PersonalExpenses, PersonalIncomes } from '@prisma/client';
import {
  ModifiedPersonalExpense,
  ModifiedPersonalIncome,
  TransactionType,
} from '@/types/types';

interface EditTransactionModalContextProps {
  showEditTransactionModal: boolean;
  setShowEditTransactionModal: (show: boolean) => void;
  isLoading: boolean;
  setIsLoading: (value: boolean) => void;
  transactionId: string;
  setTransactionId: (value: string) => void;
  transactionType: TransactionType;
  setTransactionType: (value: TransactionType) => void;
  transaction: ModifiedPersonalIncome | ModifiedPersonalExpense | null;
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
    transaction: null,
  });

export const EditTransactionModalProvider = ({ children }: { children: ReactNode }) => {
  const [showEditTransactionModal, setShowEditTransactionModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [transactionId, setTransactionId] = useState('');
  const [transactionType, setTransactionType] = useState<TransactionType>(null);
  const [transaction, setTransaction] = useState<
    ModifiedPersonalIncome | ModifiedPersonalExpense | null
  >(null);

  useEffect(() => {
    (async () => {
      if (!transactionId || !transactionType) return;

      if (transactionType === 'income') {
        setIsLoading(true);
        const transaction = await getPersonalIncomeById(transactionId);
        setIsLoading(false);
        if (!transaction) return;

        setTransaction(transaction);
      }

      if (transactionType === 'expense') {
        setIsLoading(true);
        const transaction = await getPersonalExpenseById(transactionId);
        setIsLoading(false);
        if (!transaction) return;

        setTransaction(transaction);
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
        transaction,
      }}
    >
      {children}
    </EditTransactionModalContext.Provider>
  );
};
