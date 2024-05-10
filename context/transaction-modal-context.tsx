'use client';

import { ReactNode, createContext, useState } from 'react';

interface TransactionModalContextProps {
  showTransationModal: boolean;
  setShowTransationModal: (show: boolean) => void;
}

export const TransactionModalContext = createContext<TransactionModalContextProps>({
  showTransationModal: false,
  setShowTransationModal: (show: boolean) => {},
});

export const TransactionModalProvider = ({ children }: { children: ReactNode }) => {
  const [showTransationModal, setShowTransationModal] = useState(false);

  return (
    <TransactionModalContext.Provider
      value={{ showTransationModal, setShowTransationModal }}
    >
      {children}
    </TransactionModalContext.Provider>
  );
};
