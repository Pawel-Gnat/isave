'use client';

import Image from 'next/image';
import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { pl } from 'date-fns/locale';

import { Button } from '@/components/ui/button';

import { ArrowUpDown } from 'lucide-react';

import { PersonalExpenses, PersonalIncome } from '@prisma/client';

export const columns: ColumnDef<PersonalIncome | PersonalExpenses>[] = [
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
      return (
        <div className="text-right">
          <Button variant="outline">Podgląd</Button>
        </div>
      );
    },
  },
];
