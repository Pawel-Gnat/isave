'use client';

import axios from 'axios';
import { useContext } from 'react';
import { toast } from 'sonner';

import { handleApiDeleteRoute } from '@/utils/dialogUtils';

import usePersonalExpenses from '@/hooks/usePersonalExpenses';
import usePersonalIncomes from '@/hooks/usePersonalIncomes';
import useGroupBudgets from '@/hooks/useGroupBudgets';
import useGroupExpenses from '@/hooks/useGroupExpenses';
import useGroupIncomes from '@/hooks/useGroupIncomes';

import { TransactionsContext } from '@/contexts/transactions-context';
import { AlertContext } from '@/contexts/alert-context';

import { Dialog } from './dialog';

import { endOfMonth, startOfMonth } from 'date-fns';

export const DeleteTransaction = () => {
  const {
    isAlertOpen,
    transactionType,
    transactionId,
    transactionCategory,
    isLoading,
    groupBudgetId,
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
  const { groupBudgetsRefetch } = useGroupBudgets();
  const { groupExpensesRefetch } = useGroupExpenses(
    date?.from || startOfMonth(new Date()),
    date?.to || endOfMonth(new Date()),
    groupBudgetId,
  );
  const { groupIncomesRefetch } = useGroupIncomes(
    date?.from || startOfMonth(new Date()),
    date?.to || endOfMonth(new Date()),
    groupBudgetId,
  );

  const handleClose = () => {
    dispatch({ type: 'SET_HIDE_ALERT' });
  };

  const handleRefetch = () => {
    if (transactionCategory === 'group') {
      if (!transactionType) {
        return groupBudgetsRefetch();
      } else if (transactionType === 'income') {
        groupIncomesRefetch();
      } else if (transactionType === 'expense') {
        groupExpensesRefetch();
      }
    }

    if (transactionCategory === 'personal') {
      if (transactionType === 'income') {
        return personalIncomesRefetch();
      } else if (transactionType === 'expense') {
        return personalExpensesRefetch();
      }
    }
  };

  const handleDelete = () => {
    if (isLoading) return;
    dispatch({ type: 'SET_IS_LOADING', payload: { isLoading: true } });

    axios
      .delete(
        handleApiDeleteRoute(
          transactionCategory,
          transactionType,
          transactionId,
          groupBudgetId,
        ),
      )
      .then((response) => {
        toast.success(`${response.data}`);
        handleRefetch();
        dispatch({ type: 'SET_HIDE_ALERT' });
      })
      .catch((error) => {
        toast.error(`${error.response.data.error}`);
      })
      .finally(() => {
        dispatch({ type: 'SET_IS_LOADING', payload: { isLoading: false } });
      });
  };

  return (
    <Dialog
      open={isAlertOpen}
      onOpenChange={handleClose}
      isLoading={isLoading}
      title="Potwierdzenie operacji"
      description="Czy na pewno chcesz usunąć tę pozycję? Ta operacja jest nieodwracalna i spowoduje trwałe usunięcie danych."
      handleDialog={handleDelete}
      actionText="Usuń"
    />
  );
};
