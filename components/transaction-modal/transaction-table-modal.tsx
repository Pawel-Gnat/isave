import { UseFormSetValue } from 'react-hook-form';

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
import { TransactionCategorySelect } from './transaction-category-select';

import { Trash2 } from 'lucide-react';

import { Transaction, TransactionType, TransactionValues } from '@/types/types';

interface TransactionTableModalProps {
  transactions: Transaction[];
  setValue: UseFormSetValue<TransactionValues>;
  transactionType: TransactionType;
}

export const TransactionTableModal: React.FC<TransactionTableModalProps> = ({
  transactions,
  setValue,
  transactionType,
}) => {
  const addNewRow = () => {
    setValue('transactions', [
      ...transactions,
      { id: self.crypto.randomUUID(), title: '', value: 0, categoryId: '' },
    ]);
  };

  const deleteRow = (id: string) => {
    const updatedTransactions = transactions.filter(
      (transaction) => transaction.id !== id,
    );
    setValue('transactions', updatedTransactions);
  };

  const changeTitle = (value: string, id: string) => {
    const updatedTransactions = transactions.map((transaction) =>
      transaction.id === id ? { ...transaction, title: value } : transaction,
    );

    setValue('transactions', updatedTransactions);
  };

  const changeValue = (value: number, id: string) => {
    const updatedTransactions = transactions.map((transaction) =>
      transaction.id === id ? { ...transaction, value: +value.toFixed(2) } : transaction,
    );

    setValue('transactions', updatedTransactions);
  };

  const changeCategory = (value: string, id: string) => {
    const updatedTransactions = transactions.map((transaction) =>
      transaction.id === id ? { ...transaction, categoryId: value } : transaction,
    );

    setValue('transactions', updatedTransactions);
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
        <TableBody className="block max-h-[400px] overflow-y-auto">
          {transactions.map((transaction) => (
            <TableRow key={transaction.id} className="table w-full table-fixed">
              <TableCell className="font-medium">
                <TransactionTitleInput
                  value={transaction.title}
                  onChange={(value) => changeTitle(value, transaction.id)}
                />
              </TableCell>
              <TableCell>
                <TransactionCategorySelect
                  value={transaction}
                  onChange={(value) => {
                    changeCategory(value, transaction.id);
                  }}
                  transactionType={transactionType}
                />
              </TableCell>
              <TableCell className="w-36">
                <TransactionValueInput
                  value={transaction.value}
                  onChange={(value) => changeValue(value, transaction.id)}
                />
              </TableCell>
              <TableCell className="w-48 text-right">
                <Button variant="outline" onClick={() => deleteRow(transaction.id)}>
                  Usuń pozycję
                  <Trash2 className="ml-2 h-4 w-4 shrink-0" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow className="table w-full table-fixed bg-transparent">
            <TableCell colSpan={3}>Suma</TableCell>
            <TableCell className="text-right">
              {transactions
                .reduce((acc, transaction) => acc + transaction.value, 0)
                .toFixed(2)}{' '}
              zł
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>

      <div className="relative">
        <Button variant="outline" onClick={addNewRow} className="absolute right-0">
          Dodaj nowy wiersz
        </Button>
      </div>
    </>
  );
};
