import {
  GroupExpenses,
  GroupIncomes,
  PersonalExpenses,
  PersonalIncomes,
} from '@prisma/client';
import { DateRange } from 'react-day-picker';

export type Transaction = {
  id: string;
  title: string;
  value: number;
  categoryId: string;
};

export type TransactionValues = {
  fileText: string | null;
  date: Date;
  transactions: Transaction[];
};

export type TransactionCategory = 'group' | 'personal' | null;

export type TransactionType = 'income' | 'expense' | null;

// export type NotificationStatus = 'pending' | 'fulfilled' | 'rejected';

export type ModifiedPersonalExpense = PersonalExpenses & {
  transactions: Transaction[];
};

export type ModifiedPersonalIncome = PersonalIncomes & {
  transactions: Transaction[];
};

export type ModifiedGroupExpense = GroupExpenses & {
  transactions: Transaction[];
};

export type ModifiedGroupIncome = GroupIncomes & {
  transactions: Transaction[];
};

export type AlertState = {
  isAlertOpen: boolean;
  isCreateBudgetAlertOpen: boolean;
  isLoading: boolean;
  transactionId: string;
  groupBudgetId: string;
  transactionCategory: TransactionCategory;
  transactionType: TransactionType;
};

export type TransactionState = {
  isIncomeModalOpen: boolean;
  isExpenseModalOpen: boolean;
  isEditTransactionModalOpen: boolean;
  date: DateRange | undefined;
  transactionType: TransactionType;
  transactionCategory: TransactionCategory;
  groupBudgetId: string;
  transactionId: string;
  isLoading: boolean;
};
