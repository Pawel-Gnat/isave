'use client';

import { ReactNode, createContext, useReducer } from 'react';
import { startOfMonth, endOfMonth } from 'date-fns';

import { Action, transactionReducer } from '@/reducers/transaction-modal-reducer';

import { TransactionState } from '@/types/types';

interface TransactionsContextProps extends TransactionState {
  dispatch: React.Dispatch<Action>;
}

const initialState: TransactionState = {
  isIncomeModalOpen: false,
  isExpenseModalOpen: false,
  isEditTransactionModalOpen: false,
  date: { from: startOfMonth(new Date()), to: endOfMonth(new Date()) },
  transactionType: null,
  transactionCategory: null,
  groupBudgetId: '',
  transactionId: '',
  isLoading: false,
};

export const TransactionsContext = createContext<TransactionsContextProps>({
  ...initialState,
  dispatch: () => {},
});

export const TransactionsProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(transactionReducer, initialState);

  return (
    <TransactionsContext.Provider value={{ ...state, dispatch }}>
      {children}
    </TransactionsContext.Provider>
  );
};
