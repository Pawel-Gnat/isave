'use client';

import { useContext } from 'react';

import { TransactionsContext } from '@/context/transactions-context';

import { DatePicker } from '@/components/shared/date-picker';
import { Button } from '@/components/ui/button';

export const ActionsPanel = () => {
  const { date, setDate, setShowIncomeModal, setShowTransactionModal } =
    useContext(TransactionsContext);

  return (
    <div className="mb-4 flex flex-row justify-between">
      <DatePicker date={date} setDate={setDate} />
      <div className="space-x-4">
        <Button
          variant="outline"
          onClick={() => {
            setShowIncomeModal(true);
          }}
        >
          Dodaj przychód
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            setShowTransactionModal(true);
          }}
        >
          Dodaj wydatek
        </Button>
      </div>
    </div>
  );
};
