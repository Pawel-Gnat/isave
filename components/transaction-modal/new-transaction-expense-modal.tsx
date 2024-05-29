'use client';

import { useContext, useState } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { FieldValues, useForm } from 'react-hook-form';
import { z } from 'zod';

import { TransactionModalContext } from '@/context/transaction-modal-context';

import { getApiResponse } from '@/utils/getApiResponse';
import { createTransaction } from '@/utils/createTransaction';

import { Modal } from '@/components/shared/modal';

import { FileInput } from './ui/file-input';
import { TransactionTableModal } from './ui/transaction-table-modal';
import { TransactionDatePicker } from './ui/transaction-date-picker';

import { TransactionValues } from '@/types/types';

enum STEPS {
  FILE = 0,
  TABLE = 1,
}

export const NewTransactionExpenseModal = () => {
  const { showTransactionModal, setShowTransactionModal, isLoading, setIsLoading } =
    useContext(TransactionModalContext);
  const router = useRouter();
  const [step, setStep] = useState<STEPS>(STEPS.FILE);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<TransactionValues>({
    defaultValues: {
      fileText: null,
      date: new Date(),
      transactions: [],
    },
  });

  const date = watch('date');
  const fileText = watch('fileText');
  const transactions = watch('transactions');
  let modalContent;

  const goBack = () => {
    if (isLoading) return;

    if (step === STEPS.FILE) {
      setShowTransactionModal(false);

      setTimeout(() => {
        reset();
      }, 500);
      return;
    }

    setStep((value) => value - 1);
  };

  const goNext = async () => {
    if (isLoading) return;

    if (step === STEPS.FILE && fileText) {
      const apiResponse = await getApiResponse(fileText, setIsLoading);
      setValue('date', new Date(apiResponse.date), {
        // shouldDirty: true,
        // shouldTouch: true,
        // shouldValidate: true,
      });
      setValue('transactions', apiResponse.expenses, {
        // shouldDirty: true,
        // shouldTouch: true,
        // shouldValidate: true,
      });
      console.log(apiResponse, 'apiResponse');
    }

    if (step === STEPS.TABLE) {
      const result = await createTransaction(
        date,
        transactions,
        'personal',
        'expense',
        setIsLoading,
      );

      console.log(result, 'res');

      if (result) {
        setShowTransactionModal(false);
        router.refresh();

        setTimeout(() => {
          reset();
          setStep(STEPS.FILE);
        }, 500);
        return;
      }
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

    return undefined;
  };

  const previousActionButtonLabel = () => {
    if (step === STEPS.FILE) {
      return 'Anuluj';
    }

    return 'Powrót';
  };

  if (step === STEPS.FILE) {
    modalContent = (
      <FileInput
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        onSelect={(fileText) =>
          setValue('fileText', fileText, {
            // shouldDirty: true,
            // shouldTouch: true,
            // shouldValidate: true,
          })
        }
      />
    );
  }

  if (step === STEPS.TABLE) {
    modalContent = (
      <div className="flex w-full flex-col gap-4">
        <TransactionDatePicker date={date} setDate={(date) => setValue('date', date)} />
        <TransactionTableModal
          transactions={transactions}
          setValue={setValue}
          transactionType="expense"
        />
      </div>
    );
  }

  return (
    <Modal
      isOpen={showTransactionModal}
      setIsOpen={setShowTransactionModal}
      title={handleTitle()}
      description={handleDescription()}
      actionButton={goNext}
      actionButtonLabel={actionButtonLabel()}
      secondaryActionButton={() => setStep((value) => value + 1)}
      secondaryActionButtonLabel={secondaryActionButtonLabel()}
      previousActionButtonLabel={previousActionButtonLabel()}
      previousActionButton={goBack}
      content={modalContent}
      disabled={handleActionButtonState()}
      isLoading={isLoading}
    />
  );
};
