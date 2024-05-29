'use client';

import axios from 'axios';
import { useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { FieldValues, useForm } from 'react-hook-form';
import { z } from 'zod';
import { toast } from 'sonner';

import { EditTransactionModalContext } from '@/context/edit-transaction-modal-context';

import { Button } from '@/components/ui/button';

import { LoadingButton } from '@/components/shared/loading-button';

import { TransactionTableModal } from './ui/transaction-table-modal';
import { TransactionDatePicker } from './ui/transaction-date-picker';
import { TransactionModal } from './transaction-modal';

import { TransactionValues } from '@/types/types';

export const EditTransaction = () => {
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
      toast.error('Błąd wysyłania');
    } finally {
      setIsLoading(false);
    }
  };

  const content = () => {
    return (
      <>
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
      </>
    );
  };

  const footer = () => {
    return (
      <>
        <Button variant="outline" onClick={() => hideModal()}>
          Anuluj
        </Button>
        <LoadingButton
          // variant="outline"
          isLoading={isLoading}
          onClick={() => saveData()}
          text="Zapisz zmiany"
        />
      </>
    );
  };

  return (
    <TransactionModal
      open={showEditTransactionModal}
      onOpenChange={hideModal}
      title="Edycja transakcji"
      description="Skoryguj wybrane pozycje i zapisz zmiany"
      content={content()}
      footer={footer()}
    />
  );
};
