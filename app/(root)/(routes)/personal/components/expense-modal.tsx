import axios from 'axios';
import { toast } from 'sonner';
import { useEffect, useRef, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { captureException } from '@sentry/nextjs';

import { handleExpenseApiPostRoute } from '@/utils/dialogUtils';
import { TransactionSchema } from '@/utils/formValidations';
import { logError } from '@/utils/errorUtils';

import { Button } from '@/components/ui/button';

import { LoadingButton } from '@/components/shared/loading-button';

import { FileInput } from '@/components/transaction-modal/ui/file-input';
import { TransactionTableModal } from '@/components/transaction-modal/ui/transaction-table-modal';
import { TransactionDatePicker } from '@/components/transaction-modal/ui/transaction-date-picker';

import { TransactionModal } from '@/components/transaction-modal/transaction-modal';

import { TransactionValues } from '@/types/types';
import { useQueryClient } from '@tanstack/react-query';
import getPersonalExpenseById from '@/actions/getPersonalExpenseById';

enum STEPS {
  FILE = 0,
  TABLE = 1,
}

interface ExpenseModalProps {
  isModalOpen: boolean;
  closeModal: () => void;
  editTransactionId: string;
}

const DEFAULT_VALUES = {
  fileText: null,
  date: new Date(),
  transactions: [],
};

export const ExpenseModal = ({
  isModalOpen,
  closeModal,
  editTransactionId,
}: ExpenseModalProps) => {
  const queryClient = useQueryClient();
  const [step, setStep] = useState<STEPS>(STEPS.FILE);
  const controllerRef = useRef<AbortController | null>(null);

  const {
    register,
    setValue,
    watch,
    reset,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TransactionValues>({
    resolver: zodResolver(TransactionSchema),
    defaultValues: DEFAULT_VALUES,
  });

  const date = watch('date');
  const fileText = watch('fileText');
  const transactions = watch('transactions');

  useEffect(() => {
    (async () => {
      if (!editTransactionId) return;
      const transaction = await getPersonalExpenseById(editTransactionId);

      if (transaction) {
        reset({
          date: new Date(transaction.date),
          transactions: transaction.transactions,
        });
        setStep(STEPS.TABLE);
      }
    })();
  }, [editTransactionId]);

  const hideModal = () => {
    if (controllerRef.current) {
      controllerRef.current.abort();
    }

    closeModal();
    reset(DEFAULT_VALUES);
    setStep(STEPS.FILE);
  };

  const goBack = () => {
    if (isSubmitting) return;

    if (step === STEPS.FILE) {
      return hideModal();
    }

    setStep((value) => value - 1);
  };

  const onSubmit = async (data: TransactionValues) => {
    const newController = new AbortController();
    controllerRef.current = newController;

    try {
      if (step === STEPS.FILE && fileText) {
        const response = await axios.post(
          `/api/ai`,
          { fileText },
          { signal: newController.signal },
        );

        setValue('transactions', response.data.expenses);
        setStep(STEPS.TABLE);
        return;
      }

      if (step === STEPS.TABLE) {
        const response = await axios.post(
          handleExpenseApiPostRoute('personal'),
          { date: data.date, transactions: data.transactions },
          { signal: newController.signal },
        );

        toast.success(`${response.data}`);
        queryClient.invalidateQueries({ queryKey: ['personalBudget'] });
        hideModal();
        return;
      }

      if (step === STEPS.FILE) {
        setStep(STEPS.TABLE);
      }
    } catch (error) {
      logError(
        () => captureException(`Frontend - expense step ${step}: ${error}`),
        error,
      );

      if (axios.isCancel(error)) {
        return toast.warning('Anulowano zapytanie');
      }

      if (axios.isAxiosError(error)) {
        if (error.response && error.response.data) {
          toast.error('Błąd', { description: error.response.data.error });
        } else {
          toast.error('Błąd', { description: 'Nieznany błąd' });
        }
      } else {
        toast.error('Nieznany błąd');
      }
    }
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

        <div className="flex flex-col gap-2 sm:flex-row">
          {handleActionButtonState() && (
            <LoadingButton
              isLoading={isSubmitting}
              onClick={() => setStep((value) => value + 1)}
              text={secondaryActionButtonLabel()}
            />
          )}

          <LoadingButton
            isLoading={isSubmitting}
            onClick={handleSubmit(onSubmit)}
            text={actionButtonLabel()}
            disabled={handleActionButtonState()}
          />
        </div>
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
