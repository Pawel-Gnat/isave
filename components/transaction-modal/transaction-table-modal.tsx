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

import { TransactionTitleInput } from './transaction-title-input';
import { TransactionValueInput } from './transaction-value-input';
import { ExpenseCategorySelect } from './expense-category-select';

import { Trash2 } from 'lucide-react';

import { Expense, ExpenseTransactionValues } from '@/types/types';
import { SelectValue } from '@radix-ui/react-select';
import { ScrollArea } from '@/components/ui/scroll-area';

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

  const deleteRow = (id: string) => {
    const updatedExpenses = expenses.filter((expense) => expense.id !== id);
    setValue('expenses', updatedExpenses);
  };

  const changeTitle = (value: string, id: string) => {
    const updatedExpenses = expenses.map((expense) =>
      expense.id === id ? { ...expense, title: value } : expense,
    );

    setValue('expenses', updatedExpenses);
  };

  const changeValue = (value: number, id: string) => {
    const updatedExpenses = expenses.map((expense) =>
      expense.id === id ? { ...expense, value: +value.toFixed(2) } : expense,
    );

    setValue('expenses', updatedExpenses);
  };

  const changeCategory = (value: string, id: string) => {
    const updatedExpenses = expenses.map((expense) =>
      expense.id === id ? { ...expense, categoryId: value } : expense,
    );

    setValue('expenses', updatedExpenses);
  };

  return (
    <>
      <Table>
        <TableHeader className="table w-full table-fixed">
          <TableRow>
            <TableHead>Nazwa</TableHead>
            <TableHead>Kategoria</TableHead>
            <TableHead className="w-36">Cena [zł]</TableHead>
            <TableHead className="w-48 text-right"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="block max-h-[300px] overflow-y-auto">
          {expenses.map((expense) => (
            <TableRow key={expense.id} className="table w-full table-fixed">
              <TableCell className="font-medium">
                <TransactionTitleInput
                  value={expense.title}
                  onChange={(value) => changeTitle(value, expense.id)}
                />
              </TableCell>
              <TableCell>
                <ExpenseCategorySelect
                  value={expense}
                  onChange={(value) => {
                    changeCategory(value, expense.id);
                  }}
                />
              </TableCell>
              <TableCell className="w-36">
                <TransactionValueInput
                  value={expense.value}
                  onChange={(value) => changeValue(value, expense.id)}
                />
              </TableCell>
              <TableCell className="w-48 text-right">
                <Button variant="outline" onClick={() => deleteRow(expense.id)}>
                  Usuń pozycję
                  <Trash2 className="ml-2 h-4 w-4 shrink-0" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="relative">
        <Button variant="outline" onClick={addNewRow} className="absolute right-0">
          Dodaj nowy wiersz
        </Button>
      </div>
    </>
  );
};
