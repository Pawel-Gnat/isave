'use client';

import { useContext } from 'react';

import { TransactionsContext } from '@/contexts/transactions-context';

import { DatePicker } from '@/components/shared/date-picker';

import { Button } from '@/components/ui/button';

import { DateRange } from 'react-day-picker';
import { TransactionCategory } from '@/types/types';
import { useUrlSearchParams } from '@/hooks/useUrlSearchParams';
import { endOfMonth, format, startOfMonth } from 'date-fns';

interface ActionsPanelProps {
  id?: string;
  category: TransactionCategory;
}

export const ActionsPanel = ({ id, category }: ActionsPanelProps) => {
  const { dispatch } = useContext(TransactionsContext);
  const [searchParams, updateParams] = useUrlSearchParams();

  const handleSetDate = (date: DateRange | undefined) => {
    updateParams((params) => {
      params.set('from', format(date?.from || startOfMonth(new Date()), 'yyyy-MM-dd'));
      params.set('to', format(date?.to || endOfMonth(new Date()), 'yyyy-MM-dd'));
    });
  };

  return (
    <div className="mb-4 flex flex-col items-center justify-between gap-4 sm:items-end md:flex-row">
      <DatePicker
        date={{
          from: new Date(searchParams.get('from') || startOfMonth(new Date())),
          to: new Date(searchParams.get('to') || endOfMonth(new Date())),
        }}
        setDate={handleSetDate}
      />
      <div className="space-x-2 sm:space-x-4">
        <Button
          variant="outline"
          onClick={() => {
            dispatch({
              type: 'SET_SHOW_INCOME_MODAL',
              payload: { groupBudgetId: id || '', transactionCategory: category },
            });
          }}
        >
          Dodaj przychód
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            dispatch({
              type: 'SET_SHOW_EXPENSE_MODAL',
              payload: { groupBudgetId: id || '', transactionCategory: category },
            });
          }}
        >
          Dodaj wydatek
        </Button>
      </div>
    </div>
  );
};
