import { FC } from 'react';

import { Skeleton } from '../../../../components/ui/skeleton';

import { PersonalExpenses, PersonalIncomes } from '@prisma/client';

interface StatsCardProps {
  data: PersonalExpenses[] | PersonalIncomes[] | null | undefined;
  isLoading: boolean;
  heading: string;
}

export const StatsCard: FC<StatsCardProps> = ({ isLoading, data, heading }) => {
  if (isLoading) {
    return <Skeleton className="h-28 w-52" />;
  }

  return (
    <div className="flex h-28 w-52 flex-col justify-between gap-4 rounded-lg border p-4">
      <p>{heading}</p>
      <p className="text-right text-xl font-bold">
        {data && data.reduce((acc, curr) => acc + curr.value, 0).toFixed(2)} zł
      </p>
    </div>
  );
};
