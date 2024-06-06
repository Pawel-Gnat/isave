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
  date: DateRange | undefined;
  setDate: (date: DateRange | undefined) => void;
  isLoading: boolean;
}

export const TransactionsContext = createContext<TransactionsContextProps>({
  // personalTransactions: [],
  date: { from: new Date(), to: new Date() },
  setDate: () => {},
  isLoading: false,
});

interface TransactionsProviderProps {
  children: ReactNode;
  // dateFrom: Date;
  // dateTo: Date;
  // expenses: PersonalExpenses[] | PersonalIncomes[];
}

export const TransactionsProvider: FC<TransactionsProviderProps> = ({
  children,
  // dateFrom,
  // dateTo,
  // expenses,
}) => {
  // const [personalTransactions, setPersonalTransactions] = useState<
  //   PersonalExpenses[] | PersonalIncomes[]
  // >(expenses);
  // const [date, setDate] = useState<DateRange | undefined>({
  //   from: dateFrom,
  //   to: dateTo,
  // });
  const [date, setDate] = useState<DateRange | undefined>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // const fetchTransactions = async () => {
  //   if (date?.from && date?.to) {
  //     try {
  //       setIsLoading(true);
  //       const personalExpenses = await getPersonalExpenses(date);
  //       const personalIncomes = await getPersonalIncomes(date);

  //       setPersonalTransactions([
  //         ...(personalExpenses as PersonalExpenses[]),
  //         ...(personalIncomes as PersonalIncomes[]),
  //       ]);
  //     } catch (e) {
  //       console.log(e);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   }
  // };

  return (
    <TransactionsContext.Provider
      value={{
        // personalTransactions,
        date,
        setDate,
        isLoading,
      }}
    >
      {children}
    </TransactionsContext.Provider>
  );
};
