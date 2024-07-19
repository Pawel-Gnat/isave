import { FieldErrors, UseFormRegister, UseFormSetValue } from 'react-hook-form';

import useExpenseCategories from '@/hooks/useExpenseCategories';
import useIncomeCategories from '@/hooks/useIncomeCategories';

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
  register: UseFormRegister<TransactionValues>;
  errors: FieldErrors<TransactionValues>;
}

export const TransactionTableModal: React.FC<TransactionTableModalProps> = ({
  transactions,
  setValue,
  transactionType,
  register,
  errors,
}) => {
  const { incomeCategories, isIncomeCategoriesLoading } = useIncomeCategories();
  const { expenseCategories, isExpenseCategoriesLoading } = useExpenseCategories();

  if (isIncomeCategoriesLoading || isExpenseCategoriesLoading) return <p>Ładowanie...</p>;

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

    setValue('transactions', updatedTransactions, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  };

  const changeValue = (value: number, id: string) => {
    const updatedTransactions = transactions.map((transaction) =>
      transaction.id === id ? { ...transaction, value: +value.toFixed(2) } : transaction,
    );

    setValue('transactions', updatedTransactions, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  };

  const changeCategory = (value: string, id: string) => {
    const updatedTransactions = transactions.map((transaction) =>
      transaction.id === id ? { ...transaction, categoryId: value } : transaction,
    );

    setValue('transactions', updatedTransactions, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  };

  return (
    <>
      {expenseCategories && incomeCategories && (
        <>
          <Table>
            <TableHeader className="table w-full table-fixed">
              <TableRow>
                <TableHead>Nazwa</TableHead>
                <TableHead>Kategoria</TableHead>
                <TableHead className="w-36">Kwota [zł]</TableHead>
                <TableHead className="w-48 text-right"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="block max-h-[400px] overflow-y-auto">
              {transactions.map((transaction, index) => (
                <TableRow key={transaction.id} className="table w-full table-fixed">
                  <TableCell className="font-medium">
                    <TransactionTitleInput
                      {...(register(`transactions.${index}.title`),
                      {
                        onChange: (value) => changeTitle(value, transaction.id),
                      })}
                      className={
                        errors.transactions?.[index]?.title ? 'border-red-500' : ''
                      }
                      value={transaction.title}
                    />
                  </TableCell>
                  <TableCell>
                    <TransactionCategorySelect
                      {...(register(`transactions.${index}.categoryId`),
                      {
                        onChange: (value) => {
                          changeCategory(value, transaction.id);
                        },
                      })}
                      className={
                        errors.transactions?.[index]?.categoryId ? 'border-red-500' : ''
                      }
                      value={transaction}
                      transactionType={transactionType}
                      incomeCategories={incomeCategories}
                      expenseCategories={expenseCategories}
                    />
                  </TableCell>
                  <TableCell className="w-36">
                    <TransactionValueInput
                      {...(register(`transactions.${index}.value`),
                      {
                        onChange: (value) => changeValue(value, transaction.id),
                      })}
                      className={
                        errors.transactions?.[index]?.value ? 'border-red-500' : ''
                      }
                      value={+transaction.value.toFixed(2)}
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
      )}
    </>
  );
};
