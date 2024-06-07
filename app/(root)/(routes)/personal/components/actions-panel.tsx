'use client';

import { useContext } from 'react';

import { TransactionsContext } from '@/context/transactions-context';
import { TransactionModalContext } from '@/context/transaction-modal-context';
import { IncomeModalContext } from '@/context/income-modal-context';

import { DatePicker } from '@/components/shared/date-picker';
import { Button } from '@/components/ui/button';

export const ActionsPanel = () => {
  const { setShowTransactionModal } = useContext(TransactionModalContext);
  const { setShowIncomeModal } = useContext(IncomeModalContext);
  const { date, setDate } = useContext(TransactionsContext);

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
