import { PersonalExpenses, PersonalIncomes } from '@prisma/client';

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

export type ModifiedPersonalExpense = PersonalExpenses & {
  transactions: Transaction[];
};

export type ModifiedPersonalIncome = PersonalIncomes & {
  transactions: Transaction[];
};

export type AlertState = {
  isAlertOpen: boolean;
  isLoading: boolean;
  transactionId: string;
  transactionCategory: TransactionCategory;
  transactionType: TransactionType;
};
