'use client';

import { endOfMonth, startOfMonth } from 'date-fns';

import usePersonalIncomes from '@/hooks/usePersonalIncomes';

import { StatsCard } from './stats-card';

export const PersonalIncomesCard = () => {
  const { personalIncomes, isPersonalIncomesLoading } = usePersonalIncomes(
    startOfMonth(new Date()),
    endOfMonth(new Date()),
  );

  return (
    <StatsCard
      heading="Przychody osobiste"
      data={personalIncomes}
      isLoading={isPersonalIncomesLoading}
    />
  );
};
