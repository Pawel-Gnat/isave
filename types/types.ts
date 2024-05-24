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
