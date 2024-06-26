import { MemberAction, TransactionCategory, TransactionType } from '@/types/types';

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

    return `/api/transaction/${transactionCategory}/${groupBudgetId}`;
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

export const handleApiEditTransactionRoute = (
  transactionCategory: TransactionCategory,
  transactionType: TransactionType,
  transactionId: string,
  groupBudgetId: string,
) => {
  if (transactionCategory === 'group') {
    return `/api/transaction/${transactionCategory}/${groupBudgetId}/${transactionType}/${transactionId}`;
  }

  if (transactionCategory === 'personal') {
    return `/api/transaction/${transactionCategory}/${transactionType}/${transactionId}`;
  }

  return '';
};

export const handleApiMembersRoute = (
  memberAction: MemberAction,
  groupBudgetId: string,
  inviteId: string,
) => {
  if (memberAction === 'add') {
    return `/api/transaction/group/${groupBudgetId}/member`;
  }

  if (memberAction === 'remove') {
    return `/api/transaction/group/${groupBudgetId}/member/${inviteId}`;
  }

  return '';
};
