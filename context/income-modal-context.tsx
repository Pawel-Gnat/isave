'use client';

import { ReactNode, createContext, useState } from 'react';

interface IncomeModalContextProps {
  showIncomeModal: boolean;
  setShowIncomeModal: (show: boolean) => void;
  isLoading: boolean;
  setIsLoading: (value: boolean) => void;
}

export const IncomeModalContext = createContext<IncomeModalContextProps>({
  showIncomeModal: false,
  setShowIncomeModal: (show: boolean) => {},
  isLoading: false,
  setIsLoading: (value: boolean) => {},
});

export const IncomeModalProvider = ({ children }: { children: ReactNode }) => {
  const [showIncomeModal, setShowIncomeModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <IncomeModalContext.Provider
      value={{
        showIncomeModal,
        setShowIncomeModal,
        isLoading,
        setIsLoading,
      }}
    >
      {children}
    </IncomeModalContext.Provider>
  );
};
