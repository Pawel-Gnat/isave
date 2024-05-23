import axios from 'axios';
import { toast } from 'sonner';

import { Expense } from '@/types/types';

export const sendTransactionToDb = async (
  date: Date,
  expenses: Expense[],
  transactionType: 'group' | 'personal',
  transactionCategory: 'income' | 'expense',
  setIsLoading: (value: boolean) => void,
) => {
  setIsLoading(true);

  try {
    const response = await axios.post(
      `api/transaction/${transactionCategory}/${transactionType}`,
      { date, expenses },
    );

    return response.data;
  } catch (error) {
    console.log(error);
    toast.warning('Błąd wysyłania');
  } finally {
    setIsLoading(false);
  }
};
