import axios from 'axios';
import { toast } from 'sonner';
import { useEffect, useRef } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { captureException } from '@sentry/nextjs';

import { TransactionSchema } from '@/utils/formValidations';
import {
  handleApiEditTransactionRoute,
  handleIncomeApiPostRoute,
} from '@/utils/dialogUtils';
import { logError } from '@/utils/errorUtils';

import { Button } from '@/components/ui/button';

import { LoadingButton } from '@/components/shared/loading-button';

import { TransactionTableModal } from '@/components/transaction-modal/ui/transaction-table-modal';
import { TransactionDatePicker } from '@/components/transaction-modal/ui/transaction-date-picker';

import { TransactionModal } from '@/components/transaction-modal/transaction-modal';

import { TransactionValues } from '@/types/types';
import { useQueryClient } from '@tanstack/react-query';
import getGroupIncomeById from '@/actions/getGroupIncomeById';

interface IncomeModalProps {
  isModalOpen: boolean;
  closeModal: () => void;
  transactionId: string;
  groupBudgetId: string;
}

const DEFAULT_VALUES = {
  date: new Date(),
  transactions: [],
};

export const IncomeModal = ({
  isModalOpen,
  closeModal,
  transactionId,
  groupBudgetId,
}: IncomeModalProps) => {
  const queryClient = useQueryClient();
  const controllerRef = useRef<AbortController | null>(null);
  const isEditMode = Boolean(transactionId);

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
      if (!transactionId) {
        reset(DEFAULT_VALUES);
        return;
      }
      const transaction = await getGroupIncomeById(transactionId);

      if (transaction) {
        reset({
          date: new Date(transaction.date),
          transactions: transaction.transactions,
        });
      }
    })();
  }, [transactionId]);

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
      let response;

      if (isEditMode) {
        response = await axios.patch(
          handleApiEditTransactionRoute('group', 'income', transactionId, groupBudgetId),
          data,
          { signal: newController.signal },
        );
      } else {
        response = await axios.post(
          handleIncomeApiPostRoute('group', groupBudgetId),
          data,
          {
            signal: newController.signal,
          },
        );
      }

      toast.success(`${response.data}`);
      queryClient.invalidateQueries({ queryKey: ['groupIncomes'] });
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

  const handleTitle = () => {
    if (isEditMode) {
      return 'Edycja przychodu';
    }
    return 'Utwórz nowy przychód';
  };

  const handleDescription = () => {
    if (isEditMode) {
      return 'Skoryguj wybrane pozycje i zapisz zmiany';
    }
    return 'Dodaj pozycje i zapisz dane';
  };

  const actionButtonLabel = () => {
    if (isEditMode) {
      return 'Zapisz zmiany';
    }
    return 'Zapisz';
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
          text={actionButtonLabel()}
        />
      </>
    );
  };

  return (
    <TransactionModal
      open={isModalOpen}
      onOpenChange={hideModal}
      title={handleTitle()}
      description={handleDescription()}
      content={content()}
      footer={footer()}
    />
  );
};
