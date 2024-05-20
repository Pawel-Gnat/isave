export type Expense = {
  id: string;
  title: string;
  value: number;
  categoryId: string;
};

// export type OCR = {
//   date: Date;
//   expenses: Expense[];
// };

export type ExpenseTransactionValues = {
  fileText: string | null;
  date: Date;
  expenses: Expense[];
};
