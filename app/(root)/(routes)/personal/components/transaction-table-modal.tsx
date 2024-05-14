import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { Expense, OCR } from '@/types/types';

interface TransactionTableModalProps {
  expenses: Expense[];
}

export const TransactionTableModal: React.FC<TransactionTableModalProps> = ({
  expenses,
}) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nazwa</TableHead>
          <TableHead>Kategoria</TableHead>
          <TableHead className="text-right">Cena</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {expenses.map((expense) => (
          <TableRow>
            <TableCell className="font-medium">{expense.name}</TableCell>
            <TableCell>{expense.categoryId}</TableCell>
            <TableCell className="text-right">{expense.value}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
