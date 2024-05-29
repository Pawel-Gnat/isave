'use client';

import axios from 'axios';
import Image from 'next/image';
import { useContext, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { EditTransactionModalContext } from '@/context/edit-transaction-modal-context';

import { TransactionSchema } from '@/utils/formValidations';

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
  const controllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (transaction) {
      setValue('date', new Date(transaction.date));
      setValue('transactions', transaction.transactions);
    }
  }, [transaction]);

  useEffect(() => {
    return () => {
      if (controllerRef.current) {
        controllerRef.current.abort();
      }
    };
  }, []);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<TransactionValues>({
    resolver: zodResolver(TransactionSchema),
    defaultValues: {
      date: transaction ? new Date(transaction.date) : new Date(),
      transactions: transaction ? transaction.transactions : [],
    },
  });

  const date = watch('date');
  const transactions = watch('transactions');

  const hideModal = () => {
    if (controllerRef.current) {
      controllerRef.current.abort();
    }

    setShowEditTransactionModal(false);
  };

  const saveData = async (data: TransactionValues) => {
    if (isLoading || !transaction) return;
    setIsLoading(true);

    const newController = new AbortController();
    controllerRef.current = newController;

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
      if (axios.isCancel(error)) {
        return toast.warning('Anulowano zapytanie');
      }

      if (axios.isAxiosError(error)) {
        if (error.response && error.response.data) {
          toast.error('Błąd wysyłania', { description: error.response.data.error });
        } else {
          toast.error('Błąd wysyłania', { description: 'Nieznany błąd' });
        }
      } else {
        toast.error('Nieznany błąd');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const content = () => {
    return (
      <>
        {isLoading && (
          <div className="absolute inset-0 m-auto aspect-square max-h-72">
            <Image src="/analizing.png" alt="" width={300} height={300} />
            <p className="text-center text-lg">Ładowanie...</p>
          </div>
        )}

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
              register={register}
              errors={errors}
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
          isLoading={isLoading}
          onClick={handleSubmit(saveData)}
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
