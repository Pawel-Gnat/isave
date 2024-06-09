import { AlertState, TransactionCategory, TransactionType } from '@/types/types';

export type Action =
  | {
      type: 'SET_SHOW_ALERT';
      payload: {
        isAlertOpen: true;
        transactionId: string;
        transactionCategory: TransactionCategory;
        transactionType: TransactionType;
      };
    }
  | {
      type: 'SET_HIDE_ALERT';
    }
  | { type: 'SET_IS_LOADING'; payload: { isLoading: boolean } };

export const alertReducer = (state: AlertState, action: Action): AlertState => {
  switch (action.type) {
    case 'SET_SHOW_ALERT':
      return {
        ...state,
        isAlertOpen: action.payload.isAlertOpen,
        transactionId: action.payload.transactionId,
        transactionCategory: action.payload.transactionCategory,
        transactionType: action.payload.transactionType,
      };
    case 'SET_HIDE_ALERT':
      return {
        ...state,
        isAlertOpen: false,
        transactionId: '',
        transactionCategory: null,
        transactionType: null,
      };
    case 'SET_IS_LOADING':
      return {
        ...state,
        isLoading: action.payload.isLoading,
      };
    default:
      return state;
  }
};
