import { TransactionCategory, TransactionType } from '@/types/types';

export const handleApiDeleteRoute = (
  transactionCategory: TransactionCategory,
  transactionType: TransactionType,
  transactionId: string,
  groupBudgetId: string,
) => {
  if (transactionCategory === 'group') {
    if (transactionType) {
      return `/api/transaction/${transactionCategory}/${groupBudgetId}/${transactionType}/${transactionId}`;
    }

    return `/api/transaction/${transactionCategory}/${transactionId}`;
  }

  if (transactionCategory === 'personal') {
    return `/api/transaction/${transactionCategory}/${transactionType}/${transactionId}`;
  }

  return '';
};

export const handleIncomeApiPostRoute = (
  transactionCategory: TransactionCategory,
  groupBudgetId: string,
) => {
  if (transactionCategory === 'group' && groupBudgetId) {
    return `/api/transaction/${transactionCategory}/${groupBudgetId}/income`;
  }

  if (transactionCategory === 'personal') {
    return `/api/transaction/${transactionCategory}/income`;
  }

  return '';
};

export const handleExpenseApiPostRoute = (
  transactionCategory: TransactionCategory,
  groupBudgetId: string,
) => {
  if (transactionCategory === 'group' && groupBudgetId) {
    return `/api/transaction/${transactionCategory}/${groupBudgetId}/expense`;
  }

  if (transactionCategory === 'personal') {
    return `/api/transaction/personal/expense`;
  }

  return '';
};
