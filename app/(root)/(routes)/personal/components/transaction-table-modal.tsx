import { UseFormSetValue } from 'react-hook-form';

import { expenseCategories } from '@/lib/transactionCategories';

import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';

import { TransactionInput } from './transaction-input';
import { ExpenseCategorySelect } from './expense-category-select';

import { Expense, ExpenseTransactionValues } from '@/types/types';
import { SelectValue } from '@radix-ui/react-select';

interface TransactionTableModalProps {
  expenses: Expense[];
  setValue: UseFormSetValue<ExpenseTransactionValues>;
}

export const TransactionTableModal: React.FC<TransactionTableModalProps> = ({
  expenses,
  setValue,
}) => {
  console.log(expenses);

  const addNewRow = () => {
    setValue('expenses', [
      ...expenses,
      { id: self.crypto.randomUUID(), title: '', value: 0, categoryId: '' },
    ]);
  };

  const changeTitle = (value: string, id: string) => {
    const updatedExpenses = expenses.map((expense) =>
      expense.id === id ? { ...expense, title: value } : expense,
    );

    setValue('expenses', updatedExpenses);
  };

  const changeValue = (value: number, id: string) => {
    // setValue(`expenses.${id}.value`, value);
  };

  const changeCategory = (value: SelectValue, id: string) => {
    // setValue(`expenses.${id}.categoryId`, value.value);
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nazwa</TableHead>
          <TableHead>Kategoria</TableHead>
          <TableHead className="text-right">Cena</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {expenses.map((expense) => (
          <TableRow key={expense.id}>
            <TableCell className="font-medium">
              <TransactionInput
                value={expense.title}
                onChange={(value) => changeTitle(value, expense.id)}
              />
            </TableCell>
            <TableCell>
              <ExpenseCategorySelect value={expense} onChange={(value) => {}} />
            </TableCell>
            <TableCell className="text-right">{expense.value}</TableCell>
            <TableCell>Przycisk usuwania</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter className="border-none bg-transparent">
        <TableRow>
          <TableCell colSpan={4} className="text-right">
            <Button variant="outline" onClick={addNewRow}>
              Dodaj nowy wiersz
            </Button>
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
};
