import { PersonalExpenses, PersonalIncomes } from '@prisma/client';
import { transcode } from 'buffer';

export type Transaction = {
  id: string;
  title: string;
  value: number;
  categoryId: string;
};

// export type ExpenseTransactionValues = {
//   fileText: string | null;
//   date: Date;
//   transactions: Transaction[];
// };

export type TransactionValues = {
  fileText: string | null;
  date: Date;
  transactions: Transaction[];
};

export type TransactionType = 'income' | 'expense' | null;

export type ModifiedPersonalExpense = PersonalExpenses & {
  transactions: Transaction[];
};

export type ModifiedPersonalIncome = PersonalIncomes & {
  transactions: Transaction[];
};
