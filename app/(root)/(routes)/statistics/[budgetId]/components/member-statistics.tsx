import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';

import { MemberStatistics } from '@/types/types';

interface MembersStatisticsProps {
  memberExpensesStatistics?: MemberStatistics[];
  memberIncomesStatistics?: MemberStatistics[];
  budgetName?: string;
  totalExpenses?: number;
  totalIncomes?: number;
  isLoading: boolean;
}

export const MembersStatistics = ({
  memberExpensesStatistics,
  memberIncomesStatistics,
  budgetName,
  totalExpenses,
  totalIncomes,
  isLoading,
}: MembersStatisticsProps) => {
  if (isLoading) {
    return <Skeleton className="h-64 w-full" />;
  }

  if (!memberExpensesStatistics && !memberIncomesStatistics) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Statystyki członków</CardTitle>
          <CardDescription>Brak danych dla wybranego okresu</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const combinedStatistics = new Map<string, MemberStatistics>();

  memberExpensesStatistics?.forEach((member) => {
    combinedStatistics.set(member.name, {
      name: member.name,
      totalExpenses: member.totalExpenses,
      totalIncomes: 0,
    });
  });

  memberIncomesStatistics?.forEach((member) => {
    const existing = combinedStatistics.get(member.name);
    if (existing) {
      existing.totalIncomes = member.totalIncomes;
    } else {
      combinedStatistics.set(member.name, {
        name: member.name,
        totalExpenses: 0,
        totalIncomes: member.totalIncomes,
      });
    }
  });

  const allMembers = Array.from(combinedStatistics.values());

  return (
    <Card>
      <CardHeader>
        <CardTitle>Statystyki członków w wybranym okresie</CardTitle>
        <CardDescription>
          Podsumowanie wydatków i przychodów każdego członka budżetu "{budgetName}"
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {allMembers.map((member, index) => (
          <div key={index}>
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-2">
                <span className="font-medium">{member.name}</span>
              </div>
              <div className="text-right">
                <div className="font-semibold text-red-600">
                  Wydatki: {member.totalExpenses.toFixed(2)} zł
                </div>
                <div className="text-sm text-green-600">
                  Przychody: {member.totalIncomes.toFixed(2)} zł
                </div>
              </div>
            </div>
            {index < allMembers.length - 1 && <Separator />}
          </div>
        ))}

        <Separator className="my-4" />

        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-lg font-bold text-red-600">
              {totalExpenses?.toFixed(2)} zł
            </div>
            <div className="text-muted-foreground text-sm">Łączne wydatki grupy</div>
          </div>

          <div className="text-center">
            <div className="text-lg font-bold text-green-600">
              {totalIncomes?.toFixed(2)} zł
            </div>
            <div className="text-muted-foreground text-sm">Łączne przychody grupy</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
