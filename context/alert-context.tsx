'use client';

import { createContext, useState } from 'react';

import { TransactionType } from '@/types/types';

interface AlertContextProps {
  isAlertOpen: boolean;
  setIsAlertOpen: (value: boolean) => void;
  isLoading: boolean;
  setIsLoading: (value: boolean) => void;
  transactionId: string;
  setTransactionId: (value: string) => void;
  transactionCategory: 'group' | 'personal' | null;
  setTransactionCategory: (value: 'group' | 'personal' | null) => void;
  transactionType: TransactionType;
  setTransactionType: (value: TransactionType) => void;
}

export const AlertContext = createContext<AlertContextProps>({
  isAlertOpen: false,
  setIsAlertOpen: () => {},
  isLoading: false,
  setIsLoading: () => {},
  transactionId: '',
  setTransactionId: () => {},
  transactionCategory: null,
  setTransactionCategory: () => {},
  transactionType: null,
  setTransactionType: () => {},
});

export const AlertProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [transactionId, setTransactionId] = useState('');
  const [transactionCategory, setTransactionCategory] = useState<
    'group' | 'personal' | null
  >(null);
  const [transactionType, setTransactionType] = useState<TransactionType>(null);

  return (
    <AlertContext.Provider
      value={{
        isAlertOpen,
        setIsAlertOpen,
        isLoading,
        setIsLoading,
        transactionId,
        setTransactionId,
        transactionCategory,
        setTransactionCategory,
        transactionType,
        setTransactionType,
      }}
    >
      {children}
    </AlertContext.Provider>
  );
};
