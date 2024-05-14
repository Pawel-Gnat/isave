export type Expense = {
  name: string;
  value: number;
  categoryId: string;
};

export type OCR = {
  date: Date;
  expenses: Expense[];
};
