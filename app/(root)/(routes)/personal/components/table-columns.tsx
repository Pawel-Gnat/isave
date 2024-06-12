'use client';

import { useContext } from 'react';
import Image from 'next/image';
import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { pl } from 'date-fns/locale';

import { AlertContext } from '@/contexts/alert-context';
import { TransactionsContext } from '@/contexts/transactions-context';

import { Button } from '@/components/ui/button';

import { ArrowUpDown, Eye, Trash2 } from 'lucide-react';

import { PersonalExpenses, PersonalIncomes } from '@prisma/client';
import { TransactionType } from '@/types/types';

interface ButtonProps {
  id: string;
  transactionType: TransactionType;
}

const EditButton: React.FC<ButtonProps> = ({ id, transactionType }) => {
  const { dispatch } = useContext(TransactionsContext);

  return (
    <Button
      variant="outline"
      className="mr-2"
      onClick={() => {
        dispatch({
          type: 'SET_SHOW_EDIT_TRANSACTION_MODAL',
          payload: {
            transactionId: id,
            transactionType: transactionType,
          },
        });
      }}
    >
      <Eye />
    </Button>
  );
};

const DeleteButton: React.FC<ButtonProps> = ({ id, transactionType }) => {
  const { dispatch } = useContext(AlertContext);

  return (
    <Button
      variant="destructive"
      onClick={() => {
        dispatch({
          type: 'SET_SHOW_ALERT',
          payload: {
            transactionCategory: 'personal',
            transactionType: transactionType,
            transactionId: id,
          },
        });
      }}
    >
      <Trash2 />
    </Button>
  );
};

export const columns: ColumnDef<PersonalIncomes | PersonalExpenses>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Nazwa
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const value = parseFloat(row.getValue('value'));

      return (
        <div className="flex flex-row items-center gap-4">
          <div className="rounded-full border">
            <Image
              src={value > 0 ? '/income.png' : '/expense.png'}
              alt=""
              width={50}
              height={50}
              className="aspect-square"
            />
          </div>
          <p className="font-medium">{value > 0 ? 'Przychód' : 'Wydatek'}</p>
        </div>
      );
    },
  },
  {
    accessorKey: 'date',
    header: ({ column }) => {
      return (
        <div className="text-center">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Data
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      const date = format(row.getValue('date'), 'PPP', { locale: pl });

      return <p className="text-center font-medium">{date}</p>;
    },
  },
  {
    accessorKey: 'value',
    header: ({ column }) => {
      return (
        <div className="text-center">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Kwota
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      const value = parseFloat(row.getValue('value'));
      const formatted = new Intl.NumberFormat('pl-PL', {
        style: 'currency',
        currency: 'PLN',
      }).format(value);

      return <p className="text-center font-medium">{formatted}</p>;
    },
  },
  {
    accessorKey: 'actions',
    header: () => <div className="text-right">Szczegóły</div>,
    cell: ({ row }) => {
      const id = row.original.id;
      const value = parseFloat(row.getValue('value'));

      return (
        <div className="text-right">
          <EditButton id={id} transactionType={value > 0 ? 'income' : 'expense'} />
          <DeleteButton id={id} transactionType={value > 0 ? 'income' : 'expense'} />
        </div>
      );
    },
  },
];
