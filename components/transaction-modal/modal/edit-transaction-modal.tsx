'use client';

import axios from 'axios';
import { useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { FieldValues, useForm } from 'react-hook-form';
import { z } from 'zod';
import { toast } from 'sonner';

import { EditTransactionModalContext } from '@/context/edit-transaction-modal-context';

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
    },
  });

  const date = watch('date');
  const transactions = watch('transactions');

  const hideModal = () => {
    if (isLoading) return;

    setShowEditTransactionModal(false);
    // setTimeout(() => {
    //   reset();
    // }, 500);
  };

  const saveData = async () => {
    if (isLoading || !transaction) return;
    setIsLoading(true);

    try {
      const response = await axios.patch(
        // that expense needs to be changed to dynamic category
        `api/transaction/${transactionType}/personal/${transaction.id}`,
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
