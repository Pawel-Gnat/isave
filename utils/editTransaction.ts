import axios from 'axios';
import { toast } from 'sonner';

import { Transaction } from '@/types/types';

export const editTransaction = async (
  transactionId: string,
  date: Date,
  transactions: Transaction[],
  transactionType: 'group' | 'personal',
  transactionCategory: 'income' | 'expense',
  setIsLoading: (value: boolean) => void,
) => {
  setIsLoading(true);

  try {
    const response = await axios.patch(
      `api/transaction/${transactionCategory}/${transactionType}/${transactionId}`,
      { date, transactions },
    );

    return response.data;
  } catch (error) {
    console.log(error);
    toast.warning('Błąd wysyłania');
  } finally {
    setIsLoading(false);
  }
};
