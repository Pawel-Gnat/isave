import { FC, useEffect, useState } from 'react';

import { BudgetLabel } from './budget-label';

import { GroupBudget, GroupBudgetMember } from '@prisma/client';
import PieChart from './pie-chart';
import useBudgetMember from '@/hooks/useBudgetMember';
import useGroupExpensesByUserId from '@/hooks/useGroupExpensesByUserId';
import { endOfMonth, startOfMonth } from 'date-fns';

interface GroupBudgetCardProps {
  budget: GroupBudget & { members: GroupBudgetMember[] };
}

interface UserExpenses {
  userId: string;
  name: string;
  totalExpenses: number;
}

export const GroupBudgetCard: FC<GroupBudgetCardProps> = ({ budget }) => {
  const [userExpenses, setUserExpenses] = useState<UserExpenses[]>([]);

  const ownerData = useBudgetMember(budget.ownerId);
  const ownerExpenses = useGroupExpensesByUserId(
    startOfMonth(new Date()),
    endOfMonth(new Date()),
    budget.id,
    budget.ownerId,
  );

  const membersData = budget.members.map((user) => useBudgetMember(user.userId));
  const membersExpenses = budget.members.map((user) =>
    useGroupExpensesByUserId(
      startOfMonth(new Date()),
      endOfMonth(new Date()),
      budget.id,
      user.userId,
    ),
  );

  useEffect(() => {
    const fetchData = async () => {
      const ownerTotalExpenses = ownerExpenses.groupExpenses
        ? ownerExpenses.groupExpenses.reduce((a, b) => a + b.value, 0)
        : 0;

      const ownerInfo: UserExpenses = {
        userId: budget.ownerId,
        name: ownerData.member ? ownerData.member.name : 'Unknown',
        totalExpenses: ownerTotalExpenses,
      };

      const membersInfo: UserExpenses[] = budget.members.map((user, index) => {
        const memberData = membersData[index];
        const expensesData = membersExpenses[index];

        const totalExpenses = expensesData.groupExpenses
          ? expensesData.groupExpenses.reduce((a, b) => a + b.value, 0)
          : 0;

        return {
          userId: user.userId,
          name: memberData.member ? memberData.member.name : 'Unknown',
          totalExpenses,
        };
      });

      setUserExpenses([ownerInfo, ...membersInfo]);
    };

    fetchData();
  }, [
    ownerData,
    ownerExpenses,
    membersData,
    membersExpenses,
    budget.members,
    budget.ownerId,
  ]);

  return (
    <div className="flex flex-col justify-between gap-4 rounded-lg border p-4">
      <p>{budget.name}</p>
      <div className="flex flex-row justify-between gap-4">
        {/* <PieChart
          chartData={{
            labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
            datasets: [
              {
                label: '# of Votes',
                data: [12, 19, 3, 5, 2, 3],
                backgroundColor: [
                  'rgba(255, 99, 132, 0.2)',
                  'rgba(54, 162, 235, 0.2)',
                  'rgba(255, 206, 86, 0.2)',
                  'rgba(75, 192, 192, 0.2)',
                  'rgba(153, 102, 255, 0.2)',
                  'rgba(255, 159, 64, 0.2)',
                ],
                borderColor: [
                  'rgba(255, 99, 132, 1)',
                  'rgba(54, 162, 235, 1)',
                  'rgba(255, 206, 86, 1)',
                  'rgba(75, 192, 192, 1)',
                  'rgba(153, 102, 255, 1)',
                  'rgba(255, 159, 64, 1)',
                ],
                borderWidth: 1,
              },
            ],
          }}
        /> */}
        <PieChart
          chartData={{
            labels: userExpenses.map((user) => user.name),
            datasets: [
              {
                label: 'Wydatki',
                data: userExpenses.map((user) => user.totalExpenses),
                backgroundColor: [
                  'rgba(255, 99, 132, 0.2)',
                  'rgba(54, 162, 235, 0.2)',
                  'rgba(255, 206, 86, 0.2)',
                  'rgba(75, 192, 192, 0.2)',
                  'rgba(153, 102, 255, 0.2)',
                  'rgba(255, 159, 64, 0.2)',
                ],
                borderColor: [
                  'rgba(255, 99, 132, 1)',
                  'rgba(54, 162, 235, 1)',
                  'rgba(255, 206, 86, 1)',
                  'rgba(75, 192, 192, 1)',
                  'rgba(153, 102, 255, 1)',
                  'rgba(255, 159, 64, 1)',
                ],
                borderWidth: 1,
              },
            ],
          }}
        />

        <div className="flex flex-col items-end gap-4">
          {/* <BudgetLabel userId={budget.ownerId} budgetId={budget.id} owner />
          {budget.members.map((user) => (
            <BudgetLabel
              key={user.id}
              userId={user.userId}
              budgetId={budget.id}
              owner={false}
            />
          ))} */}

          {userExpenses.map((user) => (
            <BudgetLabel
              key={user.userId}
              //   userId={user.userId}
              //   budgetId={budget.id}
              //   owner={false}
              name={user.name}
              totalExpenses={user.totalExpenses}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
