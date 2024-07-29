'use client';

import Link from 'next/link';
import { toast } from 'sonner';
import { FC, useContext } from 'react';

import { AlertContext } from '@/contexts/alert-context';

import { Button } from '@/components/ui/button';

import { BudgetBadge } from './budget-badge';

import { SquareArrowOutUpRight, Trash2, UserMinus, UserPlus } from 'lucide-react';

import { GroupBudgetMember } from '@prisma/client';

interface BudgetProps {
  title: string;
  id: string;
  href: string;
  ownerId: string;
  members: GroupBudgetMember[];
  userId: string;
}

export const Budget: FC<BudgetProps> = ({
  title,
  id,
  href,
  ownerId,
  members,
  userId,
}) => {
  const { dispatch } = useContext(AlertContext);

  const handleSaveInvideIdToClipboard = (id: string) => {
    navigator.clipboard.writeText(id);
    toast.success('Skopiowano ID do schowka');
  };

  return (
    <div className="flex flex-col gap-4 rounded-lg border p-4 transition-colors">
      <div className="flex flex-row justify-between gap-4">
        <Link href={href} className="group flex flex-row gap-2 border-b">
          {title}
          <SquareArrowOutUpRight className="transition-all group-hover:translate-x-2 group-hover:text-accent" />
        </Link>

        <Button
          disabled={userId !== ownerId}
          variant="destructive"
          className="mr-2"
          onClick={() => {
            dispatch({
              type: 'SET_SHOW_ALERT',
              payload: {
                transactionCategory: 'group',
                groupBudgetId: id,
                transactionType: null,
                transactionId: '',
              },
            });
          }}
        >
          <Trash2 />
        </Button>
      </div>
      <div className="flex flex-col justify-between gap-4 sm:flex-row">
        <div className="flex flex-wrap items-end gap-2">
          <BudgetBadge
            id={ownerId}
            owner={true}
            onClick={handleSaveInvideIdToClipboard}
          />

          {members.map((user) => (
            <BudgetBadge
              key={user.id}
              id={user.userId}
              owner={false}
              onClick={handleSaveInvideIdToClipboard}
            />
          ))}
        </div>
        <div>
          <Button
            disabled={userId !== ownerId}
            variant="outline"
            className="mr-2"
            onClick={() => {
              dispatch({
                type: 'SET_SHOW_MEMBERSHIP_ALERT',
                payload: {
                  groupBudgetId: id,
                  memberAction: 'remove',
                },
              });
            }}
          >
            <UserMinus />
          </Button>
          <Button
            disabled={userId !== ownerId}
            variant="outline"
            className="mr-2"
            onClick={() => {
              dispatch({
                type: 'SET_SHOW_MEMBERSHIP_ALERT',
                payload: {
                  groupBudgetId: id,
                  memberAction: 'add',
                },
              });
            }}
          >
            <UserPlus />
          </Button>
        </div>
      </div>
    </div>
  );
};
