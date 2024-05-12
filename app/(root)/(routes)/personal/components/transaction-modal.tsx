'use client';

import { useContext, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { FieldValues, useForm } from 'react-hook-form';
import { z } from 'zod';

import { TransactionModalContext } from '@/context/transaction-modal-context';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { Modal } from '@/components/shared/modal';
import { FileInput } from '@/components/shared/file-input';
import Image from 'next/image';

enum STEPS {
  FILE = 0,
  TABLE = 1,
  SUMMARY = 2,
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
  } = useForm<FieldValues>({
    defaultValues: {
      fileText: null,
      expenses: [],
    },
  });

  const expenses = watch('expenses');
  const fileText = watch('fileText');
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

  const goNext = () => {
    if (isLoading) return;

    if (step === STEPS.SUMMARY) {
      setShowTransationModal(false);

      setTimeout(() => {
        setStep(STEPS.FILE);
      }, 500);
      return;
    }

    if (step === STEPS.FILE && fileText) {
      console.log(fileText);
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
      <div>
        {expenses.map((expense: any) => {
          <p>{expense}</p>;
        })}
      </div>
    );
  }

  if (step === STEPS.SUMMARY) {
    modalContent = (
      <div>
        {expenses.map((expense: any) => {
          <strong>{expense}</strong>;
        })}
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
