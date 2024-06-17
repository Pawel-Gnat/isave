import { DateRange } from 'react-day-picker';
import { TransactionCategory, TransactionState, TransactionType } from '@/types/types';

export type Action =
  | {
      type: 'SET_SHOW_INCOME_MODAL';
      payload: {
        groupBudgetId: string;
        transactionCategory: TransactionCategory;
      };
    }
  | {
      type: 'SET_SHOW_EXPENSE_MODAL';
    }
  | {
      type: 'SET_SHOW_EDIT_TRANSACTION_MODAL';
      payload: {
        transactionId: string;
        transactionType: TransactionType | null;
      };
    }
  | {
      type: 'SET_HIDE_MODAL';
    }
  | {
      type: 'SET_DATE';
      payload: {
        date: DateRange | undefined;
      };
    }
  | { type: 'SET_IS_LOADING'; payload: { isLoading: boolean } };

export const transactionReducer = (
  state: TransactionState,
  action: Action,
): TransactionState => {
  switch (action.type) {
    case 'SET_SHOW_INCOME_MODAL':
      return {
        ...state,
        isIncomeModalOpen: true,
        groupBudgetId: action.payload.groupBudgetId,
        transactionCategory: action.payload.transactionCategory,
      };
    case 'SET_SHOW_EXPENSE_MODAL':
      return {
        ...state,
        isExpenseModalOpen: true,
      };
    case 'SET_SHOW_EDIT_TRANSACTION_MODAL':
      return {
        ...state,
        isEditTransactionModalOpen: true,
        transactionId: action.payload.transactionId,
        transactionType: action.payload.transactionType,
      };
    case 'SET_HIDE_MODAL':
      return {
        ...state,
        isIncomeModalOpen: false,
        isExpenseModalOpen: false,
        isEditTransactionModalOpen: false,
        transactionId: '',
        transactionType: null,
        transactionCategory: null,
        groupBudgetId: '',
      };
    case 'SET_DATE':
      return {
        ...state,
        date: action.payload.date,
      };
    case 'SET_IS_LOADING':
      return {
        ...state,
        isLoading: action.payload.isLoading,
      };
    default:
      throw new Error('Unhandled action type in TransactionReducer');
  }
};
