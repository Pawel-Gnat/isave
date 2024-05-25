'use client';

import { useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { FieldValues, useForm } from 'react-hook-form';
import { z } from 'zod';

import { EditTransactionModalContext } from '@/context/edit-transaction-modal-context';

import { sendTransactionToDb } from '@/utils/sendTransationToDb';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

import { LoadingButton } from '@/components/shared/loading-button';

import { TransactionTableModal } from '../transaction-table-modal';
import { TransactionDatePicker } from '../transaction-date-picker';

import { TransactionValues } from '@/types/types';

export const EditTransactionModal = () => {
  const {
    showEditTransactionModal,
    setShowEditTransactionModal,
    isLoading,
    setIsLoading,
    transaction,
    transactionType,
  } = useContext(EditTransactionModalContext);
  const router = useRouter();

  useEffect(() => {
    if (transaction) {
      setValue('date', new Date(transaction.date));
      setValue('transactions', transaction.transactions);
    }
  }, [transaction]);

  // console.log(transaction);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<TransactionValues>({
    defaultValues: {
      date: transaction ? new Date(transaction.date) : new Date(),
      transactions: transaction ? transaction.transactions : [],
      // date: new Date(),
      // transactions: [],
    },
  });

  const date = watch('date');
  const transactions = watch('transactions');
  // console.log(date, transactions);

  const hideModal = () => {
    if (isLoading) return;

    setShowEditTransactionModal(false);
    // setTimeout(() => {
    //   reset();
    // }, 500);
  };

  const saveData = async () => {
    if (isLoading) return;

    // const result = await sendTransactionToDb(
    //   date,
    //   transactions,
    //   'personal',
    //   'expense',
    //   setIsLoading,
    // );
  };

  return (
    <Dialog open={showEditTransactionModal} onOpenChange={hideModal}>
      <DialogContent className="flex max-h-[75%] min-h-[60%] min-w-[50%] max-w-[75%] flex-col">
        <DialogHeader>
          <DialogTitle>Edycja transakcji</DialogTitle>
          <DialogDescription>Skoryguj wybrane pozycje i zapisz zmiany</DialogDescription>
        </DialogHeader>
        <div className="relative flex flex-1 justify-center overflow-auto">
          {isLoading && <p>Ładowanie...</p>}

          {!isLoading && (
            <div className="flex w-full flex-col gap-4">
              <TransactionDatePicker
                date={date}
                setDate={(date) => setValue('date', date)}
              />
              <TransactionTableModal
                transactions={transactions}
                setValue={setValue}
                transactionType={transactionType}
              />
            </div>
          )}
        </div>
        <DialogFooter className="flex gap-2 sm:justify-between">
          <Button variant="outline" onClick={() => hideModal()}>
            Anuluj
          </Button>
          <LoadingButton
            // variant="outline"
            isLoading={isLoading}
            onClick={() => saveData()}
            text="Zapisz zmiany"
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
