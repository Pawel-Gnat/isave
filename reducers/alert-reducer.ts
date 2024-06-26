import {
  AlertState,
  MemberAction,
  TransactionCategory,
  TransactionType,
} from '@/types/types';

export type Action =
  | {
      type: 'SET_SHOW_ALERT';
      payload: {
        transactionId: string;
        groupBudgetId: string;
        transactionCategory: TransactionCategory;
        transactionType: TransactionType;
      };
    }
  | {
      type: 'SET_SHOW_CREATE_BUDGET';
    }
  | {
      type: 'SET_SHOW_MEMBERSHIP_ALERT';
      payload: {
        groupBudgetId: string;
        memberAction: MemberAction;
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
        isAlertOpen: true,
        transactionId: action.payload.transactionId,
        groupBudgetId: action.payload.groupBudgetId,
        transactionCategory: action.payload.transactionCategory,
        transactionType: action.payload.transactionType,
      };
    case 'SET_SHOW_CREATE_BUDGET':
      return {
        ...state,
        isCreateBudgetAlertOpen: true,
      };
    case 'SET_SHOW_MEMBERSHIP_ALERT':
      return {
        ...state,
        isMembershipAlertOpen: true,
        groupBudgetId: action.payload.groupBudgetId,
        memberAction: action.payload.memberAction,
      };
    case 'SET_HIDE_ALERT':
      return {
        ...state,
        isAlertOpen: false,
        isCreateBudgetAlertOpen: false,
        isMembershipAlertOpen: false,
        isLoading: false,
        transactionId: '',
        groupBudgetId: '',
        transactionCategory: null,
        transactionType: null,
        memberAction: null,
      };
    case 'SET_IS_LOADING':
      return {
        ...state,
        isLoading: action.payload.isLoading,
      };
    default:
      throw new Error('Unhandled action type in AlertReducer');
  }
};
