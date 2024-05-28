'use client';

import { ReactNode, createContext, useState } from 'react';

import { TransactionType } from '@/types/types';

interface TransactionModalContextProps {
  showTransactionModal: boolean;
  setShowTransactionModal: (show: boolean) => void;
  isLoading: boolean;
  setIsLoading: (value: boolean) => void;
  // transactionType: TransactionType;
  // setTransactionType: (value: TransactionType) => void;
  // isEditing: boolean;
  // setIsEditing: (value: boolean) => void;
}

export const TransactionModalContext = createContext<TransactionModalContextProps>({
  showTransactionModal: false,
  setShowTransactionModal: (show: boolean) => {},
  isLoading: false,
  setIsLoading: (value: boolean) => {},
  // transactionType: null,
  // setTransactionType: (value: TransactionType) => {},
  // isEditing: false,
  // setIsEditing: (value: boolean) => {},
});

export const TransactionModalProvider = ({ children }: { children: ReactNode }) => {
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  // const [transactionType, setTransactionType] = useState<TransactionType>(null);
  // const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <TransactionModalContext.Provider
      value={{
        showTransactionModal,
        setShowTransactionModal,
        isLoading,
        setIsLoading,
        // transactionType,
        // setTransactionType,
        // isEditing,
        // setIsEditing,
      }}
    >
      {children}
    </TransactionModalContext.Provider>
  );
};
