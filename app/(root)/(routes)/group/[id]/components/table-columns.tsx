import Image from 'next/image';
import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { pl } from 'date-fns/locale';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

import { ArrowUpDown, Eye, Trash2 } from 'lucide-react';

import { GroupExpenses, GroupIncomes } from '@prisma/client';
import { TransactionType } from '@/types/types';

interface ButtonProps {
  id: string;
  transactionType: TransactionType;
  onEditTransaction: (transactionId: string, transactionType: TransactionType) => void;
  onDeleteTransaction: (transactionId: string, transactionType: TransactionType) => void;
}

interface DeleteButtonProps extends ButtonProps {
  transactionOwnerId: string;
  userId: string;
}

const EditButton = ({
  id,
  transactionType,
  onEditTransaction,
}: Omit<ButtonProps, 'onDeleteTransaction'>) => {
  return (
    <Button
      variant="outline"
      className="mr-2"
      onClick={() => {
        onEditTransaction(id, transactionType);
      }}
    >
      <Eye />
    </Button>
  );
};

const DeleteButton = ({
  id,
  userId,
  transactionOwnerId,
  onDeleteTransaction,
  transactionType,
}: Omit<DeleteButtonProps, 'onEditTransaction'>) => {
  return (
    <Button
      variant="destructive"
      disabled={userId !== transactionOwnerId}
      onClick={() => {
        onDeleteTransaction(id, transactionType);
      }}
    >
      <Trash2 />
    </Button>
  );
};

export const columns = (
  onEditTransaction: (transactionId: string, transactionType: TransactionType) => void,
  onDeleteTransaction: (transactionId: string, transactionType: TransactionType) => void,
  userId: string,
): ColumnDef<GroupIncomes | GroupExpenses>[] => [
  {
    accessorKey: 'type',
    header: ({ column }) => {
      return <p className="font-medium">Typ</p>;
    },
    cell: ({ row }) => {
      const value = parseFloat(row.getValue('value'));

      return (
        <div className="flex flex-row items-center gap-4">
          <div className="min-h-12 min-w-12 rounded-full border">
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
    accessorKey: 'user',
    header: ({ column }) => {
      return <p className="text-center">Użytkownik</p>;
    },
    cell: ({ row }) => {
      return (
        <div className="text-center">
          <Badge variant="outline">{row.original.userName}</Badge>
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
      const date = format(row.getValue('date'), 'PP', { locale: pl });

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
      const transactionOwnerId = row.original.userId;
      const value = parseFloat(row.getValue('value'));

      return (
        <div className="text-right text-nowrap">
          <EditButton
            id={id}
            transactionType={value > 0 ? 'income' : 'expense'}
            onEditTransaction={onEditTransaction}
          />
          <DeleteButton
            id={id}
            transactionOwnerId={transactionOwnerId || ''}
            transactionType={value > 0 ? 'income' : 'expense'}
            onDeleteTransaction={onDeleteTransaction}
            userId={userId}
          />
        </div>
      );
    },
  },
];
