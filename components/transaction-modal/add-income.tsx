'use client';

import axios from 'axios';
import { toast } from 'sonner';
import { useContext, useEffect, useRef } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { endOfMonth, startOfMonth } from 'date-fns';
import { captureException } from '@sentry/nextjs';

import usePersonalIncomes from '@/hooks/usePersonalIncomes';
import useGroupIncomes from '@/hooks/useGroupIncomes';

import { TransactionsContext } from '@/contexts/transactions-context';

import { TransactionSchema } from '@/utils/formValidations';
import { handleIncomeApiPostRoute } from '@/utils/dialogUtils';
import { logError } from '@/utils/errorUtils';

import { Button } from '@/components/ui/button';

import { LoadingButton } from '@/components/shared/loading-button';

import { TransactionTableModal } from './ui/transaction-table-modal';
import { TransactionDatePicker } from './ui/transaction-date-picker';

import { TransactionModal } from './transaction-modal';

import { TransactionValues } from '@/types/types';

export const AddIncome = () => {
  const {
    date: dateContext,
    isIncomeModalOpen,
    isLoading,
    transactionCategory,
    groupBudgetId,
    dispatch,
  } = useContext(TransactionsContext);
  const controllerRef = useRef<AbortController | null>(null);
  const { personalIncomesRefetch } = usePersonalIncomes(
    dateContext?.from || startOfMonth(new Date()),
    dateContext?.to || endOfMonth(new Date()),
  );
  const { groupIncomesRefetch } = useGroupIncomes(
    dateContext?.from || startOfMonth(new Date()),
    dateContext?.to || endOfMonth(new Date()),
    groupBudgetId,
  );

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

    dispatch({ type: 'SET_HIDE_MODAL' });
    setTimeout(() => {
      reset();
    }, 500);
  };

  const handleRefetch = () => {
    if (transactionCategory === 'group') {
      groupIncomesRefetch();
    }

    if (transactionCategory === 'personal') {
      personalIncomesRefetch();
    }
  };

  const saveData = async (data: TransactionValues) => {
    if (isLoading) return;
    dispatch({ type: 'SET_IS_LOADING', payload: { isLoading: true } });

    const newController = new AbortController();
    controllerRef.current = newController;

    try {
      const response = await axios.post(
        handleIncomeApiPostRoute(transactionCategory, groupBudgetId),
        data,
        { signal: newController.signal },
      );

      toast.success(`${response.data}`);
      handleRefetch();
      hideModal();
    } catch (error) {
      logError(() => captureException(`Frontend - add income: ${error}`), error);

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
      dispatch({ type: 'SET_IS_LOADING', payload: { isLoading: false } });
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
      open={isIncomeModalOpen}
      onOpenChange={hideModal}
      title="Utwórz nowy przychód"
      description="Dodaj pozycje i zapisz dane"
      content={content()}
      footer={footer()}
    />
  );
};
