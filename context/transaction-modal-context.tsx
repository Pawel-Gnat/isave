'use client';

import { ReactNode, createContext, useState } from 'react';

interface TransactionModalContextProps {
  showTransactionModal: boolean;
  setShowTransactionModal: (show: boolean) => void;
  isLoading: boolean;
  setIsLoading: (value: boolean) => void;
}

export const TransactionModalContext = createContext<TransactionModalContextProps>({
  showTransactionModal: false,
  setShowTransactionModal: (show: boolean) => {},
  isLoading: false,
  setIsLoading: (value: boolean) => {},
});

export const TransactionModalProvider = ({ children }: { children: ReactNode }) => {
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <TransactionModalContext.Provider
      value={{
        showTransactionModal,
        setShowTransactionModal,
        isLoading,
        setIsLoading,
      }}
    >
      {children}
    </TransactionModalContext.Provider>
  );
};
