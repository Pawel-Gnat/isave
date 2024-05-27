'use client';

import axios from 'axios';
import { CSSProperties, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import PuffLoader from 'react-spinners/PuffLoader';

import { AlertContext } from '@/context/alert-context';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

import { LoadingButton } from './loading-button';

const override: CSSProperties = {
  borderColor: 'var(--background) var(--background) transparent',
};

export const Alert = () => {
  const router = useRouter();
  const {
    isAlertOpen,
    setIsAlertOpen,
    isLoading,
    setIsLoading,
    transactionType,
    transactionId,
    transactionCategory,
  } = useContext(AlertContext);

  const handleDelete = () => {
    if (isLoading) return;

    setIsLoading(true);

    axios
      .delete(
        `api/transaction/${transactionType}/${transactionCategory}/${transactionId}`,
      )
      .then((response) => {
        setIsAlertOpen(false);
        toast.success(`${response.data}`);
        router.refresh();
      })
      .catch((error) => {
        toast.error(`${error.message}`);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <AlertDialog open={isAlertOpen} onOpenChange={() => setIsAlertOpen(false)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Potwierdzenie operacji</AlertDialogTitle>
          <AlertDialogDescription>
            Czy na pewno chcesz usunąć tę pozycję? Ta operacja jest nieodwracalna i
            spowoduje trwałe usunięcie danych.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Anuluj</AlertDialogCancel>
          <LoadingButton isLoading={isLoading} onClick={handleDelete} text="Usuń" />
          {/* <AlertDialogAction onClick={() => handleDelete()}>
            {isLoading ? <PuffLoader size={25} cssOverride={override} /> : 'Usuń'}
          </AlertDialogAction> */}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
