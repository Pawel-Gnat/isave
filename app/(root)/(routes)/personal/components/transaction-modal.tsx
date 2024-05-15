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

import { Expense, OCR } from '@/types/types';
import { TransactionDatePicker } from './transaction-date-picker';

enum STEPS {
  FILE = 0,
  TABLE = 1,
  SUMMARY = 2,
}

interface TransactionValues {
  fileText: string | null;
  date: Date;
  expenses: Expense[];
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
  } = useForm<TransactionValues>({
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

    if (step === STEPS.SUMMARY) {
      setShowTransationModal(false);

      setTimeout(() => {
        setStep(STEPS.FILE);
      }, 500);
      return;
    }

    setStep((value) => value + 1);
  };

  const handleTitle = () => {
    if (step === STEPS.FILE) {
      return 'Utwórz nowy wydatek';
    }

    if (step === STEPS.SUMMARY) {
      return 'Podsumowanie wydatków';
    }

    return 'Twoje wydatki';
  };

  const handleDescription = () => {
    if (step === STEPS.FILE) {
      return 'Dodaj zdjęcie swojego rachunku lub przejdź dalej';
    }

    if (step === STEPS.TABLE) {
      return 'Zweryfikuj wydatki lub dodaj je samodzielnie';
    }

    return 'Podsumowanie Twojego wydatku';
  };

  const handleActionButtonState = () => step === STEPS.FILE && !fileText;

  const actionButtonLabel = () => {
    if (step === STEPS.FILE) {
      return 'Utwórz automatycznie';
    }

    if (step === STEPS.TABLE) {
      return 'Podsumowanie';
    }

    if (step === STEPS.SUMMARY) {
      return 'Zatwierdź';
    }

    return 'Dalej';
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
        <TransactionTableModal expenses={expenses} />
      </div>
    );
  }

  if (step === STEPS.SUMMARY) {
    modalContent = (
      <div>
        {/* {expenses.map((expense: any, index: number) => (
          <strong key={index}>
            {expense.name} - {expense.value}
          </strong>
        ))} */}
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
