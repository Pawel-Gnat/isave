import { FC } from 'react';

import { Badge } from '@/components/ui/badge';

interface BudgetBadgeProps {
  name: string;
  totalExpenses: number;
}

export const BudgetLabel: FC<BudgetBadgeProps> = ({ name, totalExpenses }) => {
  return (
    <div>
      <Badge variant="default" className="w-fit min-w-max">
        {name}
      </Badge>
      <p className="mt-2 text-right font-bold">{totalExpenses.toFixed(2)} zł</p>
    </div>
  );
};
