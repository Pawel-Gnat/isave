'use client';

import { useContext, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { FieldValues, useForm } from 'react-hook-form';
import { z } from 'zod';

import { TransactionModalContext } from '@/context/transaction-modal-context';

import { getApiResponse } from '@/utils/getApiResponse';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { Modal } from '@/components/shared/modal';
import { FileInput } from '@/components/shared/file-input';

import { TransactionTableModal } from './transaction-table-modal';
import { TransactionDatePicker } from './transaction-date-picker';

import { Expense, ExpenseTransactionValues } from '@/types/types';
import { sendTransactionToDb } from '@/utils/sendTransationToDb';

enum STEPS {
  FILE = 0,
  TABLE = 1,
}

export const TransactionModal = () => {
  const { showTransationModal, setShowTransationModal, isLoading, setIsLoading } =
    useContext(TransactionModalContext);

  const [step, setStep] = useState<STEPS>(STEPS.FILE);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ExpenseTransactionValues>({
    defaultValues: {
      fileText: null,
      date: new Date(),
      expenses: [],
    },
  });

  const date = watch('date');
  const fileText = watch('fileText');
  const expenses = watch('expenses');
  let modalContent;

  const goBack = () => {
    if (isLoading) return;

    if (step === STEPS.FILE) {
      setShowTransationModal(false);

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
      setValue('expenses', apiResponse.expenses, {
        // shouldDirty: true,
        // shouldTouch: true,
        // shouldValidate: true,
      });
      console.log(apiResponse, 'apiResponse');
    }

    if (step === STEPS.TABLE) {
      const result = await sendTransactionToDb(
        date,
        expenses,
        'personal',
        'expense',
        setIsLoading,
      );

      console.log(result, 'res');

      if (result) {
        setShowTransationModal(false);

        setTimeout(() => {
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
        <TransactionTableModal expenses={expenses} setValue={setValue} />
      </div>
    );
  }

  return (
    <Modal
      isOpen={showTransationModal}
      setIsOpen={setShowTransationModal}
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
