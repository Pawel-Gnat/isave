import { TransactionCategory, TransactionType } from '@/types/types';

export const handleApiDeleteRoute = (
  transactionCategory: TransactionCategory,
  transactionType: TransactionType,
  transactionId: string,
) => {
  if (transactionCategory === 'group') {
    if (transactionType) {
      return `/api/transaction/${transactionCategory}/${transactionType}/${transactionId}`;
    }

    return `/api/transaction/${transactionCategory}/${transactionId}`;
  }

  if (transactionCategory === 'personal') {
    return `/api/transaction/${transactionCategory}/${transactionType}/${transactionId}`;
  }

  return '';
};

export const handleApiPostRoute = (
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
