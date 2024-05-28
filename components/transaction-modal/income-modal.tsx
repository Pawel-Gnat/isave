'use client';

import axios from 'axios';
import { toast } from 'sonner';
import { useContext, useState } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { FieldValues, useForm } from 'react-hook-form';
import { z } from 'zod';

import { IncomeModalContext } from '@/context/income-modal-context';

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

import { TransactionTableModal } from './transaction-table-modal';
import { TransactionDatePicker } from './transaction-date-picker';

import { TransactionValues } from '@/types/types';

export const IncomeModal = () => {
  const { showIncomeModal, setShowIncomeModal, isLoading, setIsLoading } =
    useContext(IncomeModalContext);
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

    setShowIncomeModal(false);
    setTimeout(() => {
      reset();
    }, 500);
  };

  const saveData = async () => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      const response = await axios.post(
        // that expense needs to be changed to dynamic category
        `api/transaction/income/personal`,
        { date, transactions },
      );

      toast.success(`${response.data}`);
      hideModal();
      router.refresh();
    } catch (error) {
      console.log(error);
      toast.warning('Błąd wysyłania');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={showIncomeModal} onOpenChange={hideModal}>
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