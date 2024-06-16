'use client';

import Link from 'next/link';
import { FC, useContext } from 'react';

import { AlertContext } from '@/contexts/alert-context';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

import { Trash2, UserMinus, UserPlus, Users } from 'lucide-react';

interface BudgetProps {
  title: string;
  id: string;
  href: string;
  users: { name: string }[];
}

export const Budget: FC<BudgetProps> = ({ title, id, href, users }) => {
  const { dispatch } = useContext(AlertContext);

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
        <div className="flex gap-2">
          {users.map((user, index) => (
            <Button
              key={index}
              variant="ghost"
              className="h-fit self-end p-0"
              onClick={(e) => {
                e.preventDefault();
              }}
            >
              <Badge key={index} variant="default">
                {user.name}
              </Badge>
            </Button>
          ))}
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
