import axios from 'axios';
import { toast } from 'sonner';
import { useEffect, useRef } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { captureException } from '@sentry/nextjs';

import { TransactionSchema } from '@/utils/formValidations';
import { handleIncomeApiPostRoute } from '@/utils/dialogUtils';
import { logError } from '@/utils/errorUtils';

import { Button } from '@/components/ui/button';

import { LoadingButton } from '@/components/shared/loading-button';

import { TransactionTableModal } from '@/components/transaction-modal/ui/transaction-table-modal';
import { TransactionDatePicker } from '@/components/transaction-modal/ui/transaction-date-picker';

import { TransactionModal } from '@/components/transaction-modal/transaction-modal';

import { TransactionValues } from '@/types/types';
import { useQueryClient } from '@tanstack/react-query';
import getPersonalIncomeById from '@/actions/getPersonalIncomeById';

interface IncomeModalProps {
  isModalOpen: boolean;
  closeModal: () => void;
  editTransactionId: string;
}

const DEFAULT_VALUES = {
  date: new Date(),
  transactions: [],
};

export const IncomeModal = ({
  isModalOpen,
  closeModal,
  editTransactionId,
}: IncomeModalProps) => {
  const controllerRef = useRef<AbortController | null>(null);
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TransactionValues>({
    resolver: zodResolver(TransactionSchema),
    defaultValues: DEFAULT_VALUES,
  });

  const date = watch('date');
  const transactions = watch('transactions');

  useEffect(() => {
    (async () => {
      if (!editTransactionId) return;
      const transaction = await getPersonalIncomeById(editTransactionId);

      if (transaction) {
        reset({
          date: new Date(transaction.date),
          transactions: transaction.transactions,
        });
      }
    })();
  }, [editTransactionId]);

  const hideModal = () => {
    if (controllerRef.current) {
      controllerRef.current.abort();
    }
    closeModal();
    reset(DEFAULT_VALUES);
  };

  const submitIncome = async (data: TransactionValues) => {
    if (isSubmitting) return;

    const newController = new AbortController();
    controllerRef.current = newController;

    try {
      const response = await axios.post(handleIncomeApiPostRoute('personal'), data, {
        signal: newController.signal,
      });

      toast.success(`${response.data}`);
      queryClient.invalidateQueries({ queryKey: ['personalBudget'] });
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
          isLoading={isSubmitting}
          onClick={handleSubmit(submitIncome)}
          text="Zapisz"
        />
      </>
    );
  };

  return (
    <TransactionModal
      open={isModalOpen}
      onOpenChange={hideModal}
      title="Utwórz nowy przychód"
      description="Dodaj pozycje i zapisz dane"
      content={content()}
      footer={footer()}
    />
  );
};
