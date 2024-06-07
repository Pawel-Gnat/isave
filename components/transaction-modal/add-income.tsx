'use client';

import axios from 'axios';
import { toast } from 'sonner';
import { useContext, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { TransactionsContext } from '@/context/transactions-context';

import { TransactionSchema } from '@/utils/formValidations';

import { Button } from '@/components/ui/button';

import { LoadingButton } from '@/components/shared/loading-button';

import { TransactionTableModal } from './ui/transaction-table-modal';
import { TransactionDatePicker } from './ui/transaction-date-picker';

import { TransactionModal } from './transaction-modal';

import { TransactionValues } from '@/types/types';

export const AddIncome = () => {
  const { showIncomeModal, setShowIncomeModal, isLoading, setIsLoading } =
    useContext(TransactionsContext);
  const router = useRouter();
  const controllerRef = useRef<AbortController | null>(null);

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
    reset,
    formState: { errors },
  } = useForm<TransactionValues>({
    resolver: zodResolver(TransactionSchema),
    defaultValues: {
      date: new Date(),
      transactions: [],
    },
  });

  const date = watch('date');
  const transactions = watch('transactions');

  const hideModal = () => {
    if (controllerRef.current) {
      controllerRef.current.abort();
    }

    setShowIncomeModal(false);
    setTimeout(() => {
      reset();
    }, 500);
  };

  const saveData = async (data: TransactionValues) => {
    if (isLoading) return;
    setIsLoading(true);

    const newController = new AbortController();
    controllerRef.current = newController;

    try {
      const response = await axios.post(
        // that income needs to be changed to dynamic category
        `api/transaction/income/personal`,
        data,
        { signal: newController.signal },
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
        <div className="flex w-full flex-col gap-4">
          <TransactionDatePicker date={date} setDate={(date) => setValue('date', date)} />
          <TransactionTableModal
            transactions={transactions}
            setValue={setValue}
            transactionType="income"
            register={register}
            errors={errors}
          />
        </div>
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
          text="Zapisz"
        />
      </>
    );
  };

  return (
    <TransactionModal
      open={showIncomeModal}
      onOpenChange={hideModal}
      title="Utwórz nowy przychód"
      description="Dodaj pozycje i zapisz dane"
      content={content()}
      footer={footer()}
    />
  );
};
