'use client';

import {
  Dispatch,
  FC,
  ReactNode,
  SetStateAction,
  createContext,
  useEffect,
  useState,
} from 'react';
import { startOfMonth, endOfMonth } from 'date-fns';

import getExpenseCategories from '@/actions/getExpenseCategories';
import getIncomeCategories from '@/actions/getIncomeCategories';
import getPersonalExpenses from '@/actions/getPersonalExpenses';
import getPersonalIncomes from '@/actions/getPersonalIncomes';

import {
  ExpenseCategory,
  IncomeCategory,
  PersonalExpenses,
  PersonalIncomes,
} from '@prisma/client';
import { DateRange } from 'react-day-picker';

interface TransactionsContextProps {
  // personalTransactions: PersonalExpenses[] | PersonalIncomes[];
  showIncomeModal: boolean;
  setShowIncomeModal: (show: boolean) => void;
  showTransactionModal: boolean;
  setShowTransactionModal: (show: boolean) => void;
  date: DateRange | undefined;
  setDate: (date: DateRange | undefined) => void;
  isLoading: boolean;
  setIsLoading: (value: boolean) => void;
}

export const TransactionsContext = createContext<TransactionsContextProps>({
  // personalTransactions: [],
  date: { from: new Date(), to: new Date() },
  setDate: () => {},
  showIncomeModal: false,
  setShowIncomeModal: (show: boolean) => {},
  showTransactionModal: false,
  setShowTransactionModal: (show: boolean) => {},
  isLoading: false,
  setIsLoading: () => {},
});

export const TransactionsProvider = ({ children }: { children: ReactNode }) => {
  // const [personalTransactions, setPersonalTransactions] = useState<
  //   PersonalExpenses[] | PersonalIncomes[]
  // >(expenses);
  // const [date, setDate] = useState<DateRange | undefined>({
  //   from: dateFrom,
  //   to: dateTo,
  // });
  const [date, setDate] = useState<DateRange | undefined>({
    from: startOfMonth(new Date()),
    to: endOfMonth(new Date()),
  });
  const [showIncomeModal, setShowIncomeModal] = useState(false);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  return (
    <TransactionsContext.Provider
      value={{
        // personalTransactions,
        date,
        setDate,
        showIncomeModal,
        setShowIncomeModal,
        showTransactionModal,
        setShowTransactionModal,
        isLoading,
        setIsLoading,
      }}
    >
      {children}
    </TransactionsContext.Provider>
  );
};
