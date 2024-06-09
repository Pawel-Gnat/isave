'use client';

import { ReactNode, createContext, useState } from 'react';
import { startOfMonth, endOfMonth } from 'date-fns';

import { DateRange } from 'react-day-picker';
import { TransactionType } from '@/types/types';

interface TransactionsContextProps {
  showIncomeModal: boolean;
  setShowIncomeModal: (show: boolean) => void;
  showExpenseModal: boolean;
  setShowExpenseModal: (show: boolean) => void;
  showEditTransactionModal: boolean;
  setShowEditTransactionModal: (show: boolean) => void;
  date: DateRange | undefined;
  setDate: (date: DateRange | undefined) => void;
  transactionType: TransactionType;
  setTransactionType: (value: TransactionType) => void;
  transactionId: string;
  setTransactionId: (value: string) => void;
  isLoading: boolean;
  setIsLoading: (value: boolean) => void;
}

export const TransactionsContext = createContext<TransactionsContextProps>({
  date: { from: new Date(), to: new Date() },
  setDate: () => {},
  showIncomeModal: false,
  setShowIncomeModal: (show: boolean) => {},
  showExpenseModal: false,
  setShowExpenseModal: (show: boolean) => {},
  showEditTransactionModal: false,
  setShowEditTransactionModal: (show: boolean) => {},
  transactionType: null,
  setTransactionType: (value: TransactionType) => {},
  transactionId: '',
  setTransactionId: (value: string) => {},
  isLoading: false,
  setIsLoading: () => {},
});

export const TransactionsProvider = ({ children }: { children: ReactNode }) => {
  const [date, setDate] = useState<DateRange | undefined>({
    from: startOfMonth(new Date()),
    to: endOfMonth(new Date()),
  });
  const [transactionId, setTransactionId] = useState('');
  const [showIncomeModal, setShowIncomeModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [showEditTransactionModal, setShowEditTransactionModal] = useState(false);
  const [transactionType, setTransactionType] = useState<TransactionType>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  return (
    <TransactionsContext.Provider
      value={{
        date,
        setDate,
        showIncomeModal,
        setShowIncomeModal,
        showExpenseModal,
        setShowExpenseModal,
        showEditTransactionModal,
        setShowEditTransactionModal,
        transactionType,
        setTransactionType,
        transactionId,
        setTransactionId,
        isLoading,
        setIsLoading,
      }}
    >
      {children}
    </TransactionsContext.Provider>
  );
};
