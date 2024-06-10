'use client';

import { FC, ReactNode, createContext, useReducer } from 'react';

import { Action, alertReducer } from '@/reducers/alert-reducer';

import { AlertState } from '@/types/types';

interface AlertContextProps extends AlertState {
  dispatch: React.Dispatch<Action>;
}

const initialState: AlertState = {
  isAlertOpen: false,
  isLoading: false,
  transactionId: '',
  transactionCategory: null,
  transactionType: null,
};

export const AlertContext = createContext<AlertContextProps>({
  ...initialState,
  dispatch: () => {},
});

export const AlertProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(alertReducer, initialState);

  return (
    <AlertContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AlertContext.Provider>
  );
};
