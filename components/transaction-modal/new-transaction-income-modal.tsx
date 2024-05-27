'use client';

import { useContext, useState } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { FieldValues, useForm } from 'react-hook-form';
import { z } from 'zod';

import { TransactionModalContext } from '@/context/transaction-modal-context';

import { getApiResponse } from '@/utils/getApiResponse';
import { createTransaction } from '@/utils/createTransaction';

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

import { Modal } from '@/components/shared/modal';

import { FileInput } from './file-input';
import { TransactionTableModal } from './transaction-table-modal';
import { TransactionDatePicker } from './transaction-date-picker';

import { TransactionValues } from '@/types/types';

export const NewTransactionIncomeModal = () => {
  const { showTransactionModal, setShowTransactionModal, isLoading, setIsLoading } =
    useContext(TransactionModalContext);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<TransactionValues>({
    defaultValues: {
      date: new Date(),
      transactions: [],
    },
  });

  const date = watch('date');
  const transactions = watch('transactions');

  const hideModal = () => {
    if (isLoading) return;

    setShowTransactionModal(false);
    // setTimeout(() => {
    //   reset();
    // }, 500);
  };

  const saveData = async () => {
    if (isLoading) return;

    // const result = await editTransaction(
    //   transaction.id,
    //   date,
    //   transactions,
    //   'personal',
    //   'expense',
    //   setIsLoading,
    // );

    // if (result) {
    setShowTransactionModal(false);
    router.refresh();
    // }
  };

  // const goNext = async () => {
  //   if (isLoading) return;

  //   if (step === STEPS.FILE && fileText) {
  //     const apiResponse = await getApiResponse(fileText, setIsLoading);
  //     setValue('date', new Date(apiResponse.date), {
  //       // shouldDirty: true,
  //       // shouldTouch: true,
  //       // shouldValidate: true,
  //     });
  //     setValue('transactions', apiResponse.expenses, {
  //       // shouldDirty: true,
  //       // shouldTouch: true,
  //       // shouldValidate: true,
  //     });
  //     console.log(apiResponse, 'apiResponse');
  //   }

  //   if (step === STEPS.TABLE) {
  //     const result = await createTransaction(
  //       date,
  //       transactions,
  //       'personal',
  //       'expense',
  //       setIsLoading,
  //     );

  //     console.log(result, 'res');

  //     if (result) {
  //       setShowTransactionModal(false);
  //       router.refresh();

  //       setTimeout(() => {
  //         reset();
  //         setStep(STEPS.FILE);
  //       }, 500);
  //       return;
  //     }
  //   }

  //   setStep((value) => value + 1);
  // };

  return (
    <Dialog open={showTransactionModal} onOpenChange={hideModal}>
      <DialogContent className="flex max-h-[75%] min-h-[60%] min-w-[50%] max-w-[75%] flex-col">
        <DialogHeader>
          <DialogTitle>Utwórz nowy przychód</DialogTitle>
          <DialogDescription>Dodaj pozycje i zapisz dane</DialogDescription>
        </DialogHeader>
        <div className="relative flex flex-1 justify-center overflow-auto">
          <div className="flex w-full flex-col gap-4">
            <TransactionDatePicker
              date={date}
              setDate={(date) => setValue('date', date)}
            />
            <TransactionTableModal
              transactions={transactions}
              setValue={setValue}
              transactionType="income"
            />
          </div>
        </div>
        <DialogFooter className="flex gap-2 sm:justify-between">
          <Button variant="outline" onClick={() => hideModal()}>
            Anuluj
          </Button>
          <LoadingButton
            // variant="outline"
            isLoading={isLoading}
            onClick={() => saveData()}
            text="Zapisz"
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
