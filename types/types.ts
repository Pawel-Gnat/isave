import { PersonalExpenses, PersonalIncomes } from '@prisma/client';
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

export type TransactionState = {
  isIncomeModalOpen: boolean;
  isExpenseModalOpen: boolean;
  isEditTransactionModalOpen: boolean;
  date: DateRange | undefined;
  transactionType: TransactionType;
  transactionId: string;
  isLoading: boolean;
};
