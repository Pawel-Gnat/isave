'use client';

import { useContext } from 'react';

import { TransactionModalContext } from '@/context/transaction-modal-context';
import { IncomeModalContext } from '@/context/income-modal-context';

import { DatePicker } from '@/components/shared/date-picker';
import { Button } from '@/components/ui/button';

export const ActionsPanel = () => {
  // const { setShowTransactionModal, setTransactionType } = useContext(
  //   TransactionModalContext,
  // );
  const { setShowTransactionModal } = useContext(TransactionModalContext);
  const { setShowIncomeModal } = useContext(IncomeModalContext);

  return (
    <div className="mb-4 flex flex-row justify-between">
      <DatePicker />
      <div className="space-x-4">
        <Button
          variant="outline"
          onClick={() => {
            setShowIncomeModal(true);
            // setTransactionType('income');
          }}
        >
          Dodaj przychód
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            setShowTransactionModal(true);
            // setTransactionType('expense');
          }}
        >
          Dodaj wydatek
        </Button>
      </div>
    </div>
  );
};
