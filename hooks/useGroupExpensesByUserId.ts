import { useState, useEffect } from 'react';

import getGroupExpensesByUserId from '@/actions/getGroupExpensesByUserId';

import { GroupExpenses } from '@prisma/client';

export default function useGroupExpensesByUserId(
  dateFrom: Date,
  dateTo: Date,
  groupBudgetId: string,
  userId: string,
) {
  const [isLoading, setIsLoading] = useState(false);
  const [groupExpenses, setGroupExpenses] = useState<GroupExpenses[] | null>(null);

  useEffect(() => {
    const fetchGroupExpenses = async () => {
      setIsLoading(true);

      try {
        const groupExpenses = await getGroupExpensesByUserId(
          { from: dateFrom, to: dateTo },
          groupBudgetId,
          userId,
        );
        setGroupExpenses(groupExpenses);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    if (dateFrom && dateTo && groupBudgetId && userId) {
      fetchGroupExpenses();
    }
  }, []);

  return { isLoading, groupExpenses };
}
