'use client';

import { endOfMonth, startOfMonth } from 'date-fns';

import usePersonalExpenses from '@/hooks/usePersonalExpenses';

import { StatsCard } from './stats-card';

export const PersonalExpensesCard = () => {
  const { personalExpenses, isPersonalExpensesLoading } = usePersonalExpenses(
    startOfMonth(new Date()),
    endOfMonth(new Date()),
  );
  //   const { personalIncomes, isPersonalIncomesLoading } = usePersonalIncomes(
  //     date?.from || startOfMonth(new Date()),
  //     date?.to || endOfMonth(new Date()),
  //   );

  return (
    <StatsCard
      heading="Wydatki osobiste"
      data={personalExpenses}
      isLoading={isPersonalExpensesLoading}
    />
  );
};
