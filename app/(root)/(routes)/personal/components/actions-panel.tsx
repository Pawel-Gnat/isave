'use client';

import { FC, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { TransactionModalContext } from '@/context/transaction-modal-context';
import { IncomeModalContext } from '@/context/income-modal-context';

import { DatePicker } from '@/components/shared/date-picker';
import { Button } from '@/components/ui/button';

import { DateRange } from 'react-day-picker';
import { endOfMonth, format, startOfMonth } from 'date-fns';

interface ActionsPanelProps {
  dateFrom: Date;
  dateTo: Date;
}

export const ActionsPanel: FC<ActionsPanelProps> = ({ dateFrom, dateTo }) => {
  const { setShowTransactionModal } = useContext(TransactionModalContext);
  const { setShowIncomeModal } = useContext(IncomeModalContext);
  const router = useRouter();
  const [date, setDate] = useState<DateRange | undefined>({ from: dateFrom, to: dateTo });

  useEffect(() => {
    handleUrlQueryDate(date);
  }, [date?.from, date?.to]);

  const handleUrlQueryDate = (date: DateRange | undefined) => {
    if (
      date?.from &&
      date?.to &&
      (format(date?.from, 'yyyy-MM-dd') !==
        format(startOfMonth(new Date()), 'yyyy-MM-dd') ||
        format(date?.to, 'yyyy-MM-dd') !== format(endOfMonth(new Date()), 'yyyy-MM-dd'))
    ) {
      router.push(
        `/personal?from=${format(date.from, 'yyyy-MM-dd')}&to=${format(date.to, 'yyyy-MM-dd')}`,
      );
    }
  };

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
