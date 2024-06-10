'use client';

import { useContext } from 'react';

import { TransactionsContext } from '@/contexts/transactions-context';

import { DatePicker } from '@/components/shared/date-picker';

import { Button } from '@/components/ui/button';
import { DateRange } from 'react-day-picker';

export const ActionsPanel = () => {
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
            dispatch({ type: 'SET_SHOW_INCOME_MODAL' });
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
