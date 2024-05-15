import { expenseCategories } from '@/lib/transactionCategories';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { TransactionInput } from './transaction-input';
import { ExpenseCategorySelect } from './expense-category-select';

import { Expense, OCR } from '@/types/types';

interface TransactionTableModalProps {
  expenses: Expense[];
}

export const TransactionTableModal: React.FC<TransactionTableModalProps> = ({
  expenses,
}) => {
  const getCategoryName = (categoryId: string) => {
    return expenseCategories.find((category) => category.id === categoryId)?.name;
  };

  console.log(expenses);

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
          <TableRow>
            <TableCell className="font-medium">
              <TransactionInput value={expense.name} onChange={(value) => {}} />
            </TableCell>
            <TableCell>
              <ExpenseCategorySelect
                value={expense.categoryId}
                onChange={(value) => {}}
              />
            </TableCell>
            <TableCell className="text-right">{expense.value}</TableCell>
            <TableCell>Przycisk usuwania</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
