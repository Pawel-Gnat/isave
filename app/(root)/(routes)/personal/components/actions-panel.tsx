'use client';

import { useContext } from 'react';

import { TransactionModalContext } from '@/context/transaction-modal-context';

import { DatePicker } from '@/components/shared/date-picker';
import { Button } from '@/components/ui/button';

export const ActionsPanel = () => {
  const { setShowTransationModal } = useContext(TransactionModalContext);

  return (
    <div className="mb-4 flex flex-row justify-between">
      <DatePicker />
      <div className="space-x-4">
        <Button variant="outline">Dodaj przychód</Button>
        <Button variant="outline" onClick={() => setShowTransationModal(true)}>
          Dodaj wydatek
        </Button>
      </div>
    </div>
  );
};
