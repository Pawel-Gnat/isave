import { FC } from 'react';
import { endOfMonth, startOfMonth } from 'date-fns';

import useBudgetMember from '@/hooks/useBudgetMember';
import useGroupExpensesByUserId from '@/hooks/useGroupExpensesByUserId';

import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

interface BudgetBadgeProps {
  //   userId: string;
  //   budgetId: string;
  //   owner: boolean;
  name: string;
  totalExpenses: number;
}

// export const BudgetLabel: FC<BudgetBadgeProps> = ({ userId, budgetId, owner }) => {
export const BudgetLabel: FC<BudgetBadgeProps> = ({ name, totalExpenses }) => {
  //   const { member, isLoading: isMemberLoading } = useBudgetMember(userId);
  //   const { groupExpenses, isLoading: isExpensesLoading } = useGroupExpensesByUserId(
  //     startOfMonth(new Date()),
  //     endOfMonth(new Date()),
  //     budgetId,
  //     userId,
  //   );

  //   if (isMemberLoading || isExpensesLoading) {
  //     return <Skeleton className="h-6 w-24 rounded-full" />;
  //   }

  //   return (
  //     <div>
  //       {member && (
  //         <Badge variant={owner ? 'default' : 'secondary'} className="w-fit">
  //           {member.name}
  //         </Badge>
  //       )}
  //       {groupExpenses && (
  //         <p className="mt-2 text-right font-bold">
  //           {groupExpenses.reduce((a, b) => a + b.value, 0)} zł
  //         </p>
  //       )}
  //     </div>
  //   );

  return (
    <div>
      <Badge variant="default" className="w-fit">
        {name}
      </Badge>
      <p className="mt-2 text-right font-bold">{totalExpenses} zł</p>
    </div>
  );
};
