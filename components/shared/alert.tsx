'use client';

import axios from 'axios';
import { useContext } from 'react';
import { toast } from 'sonner';
import { endOfMonth, startOfMonth } from 'date-fns';

import usePersonalExpenses from '@/hooks/usePersonalExpenses';
import usePersonalIncomes from '@/hooks/usePersonalIncomes';

import { AlertContext } from '@/contexts/alert-context';
import { TransactionsContext } from '@/contexts/transactions-context';

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

import { LoadingButton } from './loading-button';

export const Alert = () => {
  const {
    isAlertOpen,
    transactionType,
    transactionId,
    transactionCategory,
    isLoading,
    dispatch,
  } = useContext(AlertContext);
  const { date } = useContext(TransactionsContext);
  const { personalExpensesRefetch } = usePersonalExpenses(
    date?.from || startOfMonth(new Date()),
    date?.to || endOfMonth(new Date()),
  );
  const { personalIncomesRefetch } = usePersonalIncomes(
    date?.from || startOfMonth(new Date()),
    date?.to || endOfMonth(new Date()),
  );

  const handleDelete = () => {
    if (isLoading) return;

    dispatch({ type: 'SET_IS_LOADING', payload: { isLoading: true } });

    axios
      .delete(
        `api/transaction/${transactionType}/${transactionCategory}/${transactionId}`,
      )
      .then((response) => {
        dispatch({ type: 'SET_HIDE_ALERT' });
        toast.success(`${response.data}`);

        if (transactionType === 'income') {
          personalIncomesRefetch();
        } else if (transactionType === 'expense') {
          personalExpensesRefetch();
        }
      })
      .catch((error) => {
        toast.error(`${error.message}`);
      })
      .finally(() => {
        dispatch({ type: 'SET_IS_LOADING', payload: { isLoading: false } });
      });
  };

  return (
    <AlertDialog
      open={isAlertOpen}
      onOpenChange={() => dispatch({ type: 'SET_HIDE_ALERT' })}
    >
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
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
