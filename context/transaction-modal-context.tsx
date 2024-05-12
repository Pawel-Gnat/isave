'use client';

import { ReactNode, createContext, useState } from 'react';

interface TransactionModalContextProps {
  showTransationModal: boolean;
  setShowTransationModal: (show: boolean) => void;
  isLoading: boolean;
  setIsLoading: (value: boolean) => void;
}

export const TransactionModalContext = createContext<TransactionModalContextProps>({
  showTransationModal: false,
  setShowTransationModal: (show: boolean) => {},
  isLoading: false,
  setIsLoading: (value: boolean) => {},
});

export const TransactionModalProvider = ({ children }: { children: ReactNode }) => {
  const [showTransationModal, setShowTransationModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <TransactionModalContext.Provider
      value={{ showTransationModal, setShowTransationModal, isLoading, setIsLoading }}
    >
      {children}
    </TransactionModalContext.Provider>
  );
};
