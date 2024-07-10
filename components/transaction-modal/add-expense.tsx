'use client';

import axios from 'axios';
import { toast } from 'sonner';
import { useContext, useEffect, useRef, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { endOfMonth, startOfMonth } from 'date-fns';

import usePersonalExpenses from '@/hooks/usePersonalExpenses';
import useGroupExpenses from '@/hooks/useGroupExpenses';

import { TransactionsContext } from '@/contexts/transactions-context';

import { TransactionSchema } from '@/utils/formValidations';

import { Button } from '@/components/ui/button';

import { LoadingButton } from '../shared/loading-button';

import { FileInput } from './ui/file-input';
import { TransactionTableModal } from './ui/transaction-table-modal';
import { TransactionDatePicker } from './ui/transaction-date-picker';

import { TransactionModal } from './transaction-modal';

import { TransactionValues } from '@/types/types';
import { handleExpenseApiPostRoute } from '@/utils/dialogUtils';

enum STEPS {
  FILE = 0,
  TABLE = 1,
}

export const AddExpense = () => {
  const {
    date: dateContext,
    isExpenseModalOpen,
    isLoading,
    transactionCategory,
    groupBudgetId,
    dispatch,
  } = useContext(TransactionsContext);
  const [step, setStep] = useState<STEPS>(STEPS.FILE);
  const controllerRef = useRef<AbortController | null>(null);

  const { personalExpensesRefetch } = usePersonalExpenses(
    dateContext?.from || startOfMonth(new Date()),
    dateContext?.to || endOfMonth(new Date()),
  );
  const { groupExpensesRefetch } = useGroupExpenses(
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
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<TransactionValues>({
    resolver: zodResolver(TransactionSchema),
    defaultValues: {
      fileText: null,
      date: new Date(),
      transactions: [],
    },
  });

  const date = watch('date');
  const fileText = watch('fileText');
  const transactions = watch('transactions');

  const handleRefetch = () => {
    if (transactionCategory === 'group') {
      groupExpensesRefetch();
    }

    if (transactionCategory === 'personal') {
      personalExpensesRefetch();
    }
  };

  const hideModal = () => {
    if (controllerRef.current) {
      controllerRef.current.abort();
    }

    dispatch({ type: 'SET_HIDE_MODAL' });
    setTimeout(() => {
      reset();
      setStep(STEPS.FILE);
    }, 500);
  };

  const goBack = () => {
    if (isLoading) return;

    if (step === STEPS.FILE) {
      return hideModal();
    }

    setStep((value) => value - 1);
  };

  const goNext = async () => {
    if (isLoading) return;

    if (step === STEPS.FILE && fileText) {
      dispatch({ type: 'SET_IS_LOADING', payload: { isLoading: true } });

      const newController = new AbortController();
      controllerRef.current = newController;

      try {
        const response = await axios.post(
          `/api/ai`,
          { fileText },
          { signal: newController.signal },
        );
        // setValue('date', new Date(response.data.date));
        setValue('transactions', response.data.expenses);
      } catch (error) {
        if (axios.isCancel(error)) {
          return toast.warning('Anulowano zapytanie');
        }

        if (axios.isAxiosError(error)) {
          if (error.response && error.response.data) {
            toast.error('Błąd odpowiedzi', { description: error.response.data.error });
          } else {
            toast.error('Błąd odpowiedzi', { description: 'Nieznany błąd' });
          }
        } else {
          toast.error('Nieznany błąd');
        }
      } finally {
        dispatch({ type: 'SET_IS_LOADING', payload: { isLoading: false } });
      }
    }

    if (step === STEPS.TABLE) {
      dispatch({ type: 'SET_IS_LOADING', payload: { isLoading: true } });

      const newController = new AbortController();
      controllerRef.current = newController;

      try {
        const response = await axios.post(
          handleExpenseApiPostRoute(transactionCategory, groupBudgetId),
          { date, transactions },
          { signal: newController.signal },
        );

        toast.success(`${response.data}`);
        handleRefetch();
        hideModal();
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
        dispatch({ type: 'SET_IS_LOADING', payload: { isLoading: false } });
      }

      return;
    }

    setStep((value) => value + 1);
  };

  const handleTitle = () => {
    if (step === STEPS.FILE) {
      return 'Utwórz nowy wydatek';
    }

    return 'Twoje wydatki';
  };

  const handleDescription = () => {
    if (step === STEPS.FILE) {
      return 'Dodaj zdjęcie swojego rachunku lub przejdź dalej';
    }

    return 'Zweryfikuj wydatki lub dodaj je samodzielnie';
  };

  const handleActionButtonState = () => step === STEPS.FILE && !fileText;

  const actionButtonLabel = () => {
    if (step === STEPS.FILE) {
      return 'Utwórz automatycznie';
    }

    return 'Zatwierdź';
  };

  const secondaryActionButtonLabel = () => {
    if (step === STEPS.FILE) {
      return 'Utwórz ręcznie';
    }

    return '';
  };

  const previousActionButtonLabel = () => {
    if (step === STEPS.FILE) {
      return 'Anuluj';
    }

    return 'Powrót';
  };

  const content = () => {
    if (step === STEPS.FILE) {
      return <FileInput onSelect={(fileText) => setValue('fileText', fileText)} />;
    }

    return (
      <div className="flex w-full flex-col gap-4">
        <TransactionDatePicker date={date} setDate={(date) => setValue('date', date)} />
        <TransactionTableModal
          transactions={transactions}
          setValue={setValue}
          transactionType="expense"
          register={register}
          errors={errors}
        />
      </div>
    );
  };

  const footer = () => {
    return (
      <>
        <Button variant="outline" onClick={() => goBack()}>
          {previousActionButtonLabel()}
        </Button>

        <div className="flex flex-row gap-2">
          {handleActionButtonState() && (
            <LoadingButton
              isLoading={isLoading}
              onClick={() => setStep((value) => value + 1)}
              text={secondaryActionButtonLabel()}
            />
          )}

          <LoadingButton
            isLoading={isLoading}
            onClick={() => goNext()}
            text={actionButtonLabel()}
            disabled={handleActionButtonState()}
          />
        </div>
      </>
    );
  };

  return (
    <TransactionModal
      open={isExpenseModalOpen}
      onOpenChange={hideModal}
      title={handleTitle()}
      description={handleDescription()}
      content={content()}
      footer={footer()}
    />
  );
};
