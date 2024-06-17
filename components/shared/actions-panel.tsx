'use client';

import { FC, useContext } from 'react';

import { TransactionsContext } from '@/contexts/transactions-context';

import { DatePicker } from '@/components/shared/date-picker';

import { Button } from '@/components/ui/button';

import { DateRange } from 'react-day-picker';
import { TransactionCategory } from '@/types/types';

interface ActionsPanelProps {
  id?: string;
  category: TransactionCategory;
}

export const ActionsPanel: FC<ActionsPanelProps> = ({ id, category }) => {
  const { date, dispatch } = useContext(TransactionsContext);

  const handleSetDate = (date: DateRange | undefined) => {
    dispatch({ type: 'SET_DATE', payload: { date } });
  };

  return (
    <div className="mb-4 flex flex-row justify-between">
      <DatePicker date={date} setDate={handleSetDate} />
      <div className="space-x-4">
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
            dispatch({ type: 'SET_SHOW_EXPENSE_MODAL' });
          }}
        >
          Dodaj wydatek
        </Button>
      </div>
    </div>
  );
};
