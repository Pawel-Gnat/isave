'use client';

import Link from 'next/link';
import { toast } from 'sonner';
import { FC, useContext } from 'react';

import { AlertContext } from '@/contexts/alert-context';

import { Button } from '@/components/ui/button';

import { BudgetBadge } from './budget-badge';

import { Trash2, UserMinus, UserPlus } from 'lucide-react';

import { GroupBudgetMember } from '@prisma/client';

interface BudgetProps {
  title: string;
  id: string;
  href: string;
  ownerId: string;
  members: GroupBudgetMember[];
}

export const Budget: FC<BudgetProps> = ({ title, id, href, ownerId }) => {
  const { dispatch } = useContext(AlertContext);

  const handleSaveInvideIdToClipboard = (id: string) => {
    navigator.clipboard.writeText(id);
    toast.success('Skopiowano ID do schowka');
  };

  return (
    <Link
      href={href}
      className="flex flex-col gap-4 rounded-lg border p-4 transition-colors hover:bg-accent"
    >
      <div className="flex flex-row justify-between gap-4">
        <p>{title}</p>
        <Button
          variant="destructive"
          className="mr-2"
          onClick={(e) => {
            e.preventDefault();
            dispatch({
              type: 'SET_SHOW_ALERT',
              payload: {
                transactionCategory: 'group',
                transactionType: null,
                transactionId: id,
              },
            });
          }}
        >
          <Trash2 />
        </Button>
      </div>
      <div className="flex flex-row justify-between gap-4">
        <div className="flex items-end gap-2">
          <BudgetBadge
            id={ownerId}
            owner={true}
            onClick={handleSaveInvideIdToClipboard}
          />

          {/* {members.map((user, index) => (
            <Button
              key={index}
              variant="ghost"
              className="h-fit self-end p-0"
              onClick={(e) => {
                e.preventDefault();
              }}
            >
              <Badge key={index} variant="default">
                {user}
              </Badge>
            </Button>
          ))} */}
        </div>
        <div>
          <Button
            variant="outline"
            className="mr-2"
            onClick={(e) => {
              e.preventDefault();
            }}
          >
            <UserMinus />
          </Button>
          <Button
            variant="outline"
            className="mr-2"
            onClick={(e) => {
              e.preventDefault();
            }}
          >
            <UserPlus />
          </Button>
        </div>
      </div>
    </Link>
  );
};
