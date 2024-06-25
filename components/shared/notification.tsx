import { FC } from 'react';

import getUserByOwnerId from '@/actions/getUserByOwnerId';
import getGroupBudgetById from '@/actions/getGroupBudgetById';

import { Button } from '../ui/button';

import { Check, X } from 'lucide-react';

import { ModifiedInviteNotification } from '@/types/types';
import { GroupBudget } from '@prisma/client';

interface NotificationProps {
  notification: ModifiedInviteNotification;
}

// export const Notification: FC<NotificationProps> = async ({ notification }) => {
export const Notification: FC<NotificationProps> = ({ notification }) => {
  // const owner = await getUserByOwnerId(notification.groupBudget.ownerId);
  // const groupBudget = (await getGroupBudgetById(
  //   notification.groupBudget.id,
  // )) as GroupBudget;

  // if (!owner || !groupBudget) {
  //   return;
  // }

  const handleAcceptButton = async () => {
    console.log('ok');
  };

  const handleRejectButton = async () => {
    console.log('reject');
  };

  return (
    <div className="flex flex-row items-end gap-4">
      <p>
        <span className="font-bold">{owner.name}</span> zaprasza do{' '}
        <span className="font-bold">{groupBudget.name}</span>
      </p>
      <div className="flex gap-2">
        <Button size="icon" variant="outline" onClick={handleAcceptButton}>
          <X />
        </Button>
        <Button size="icon" variant="outline" onClick={handleRejectButton}>
          <Check />
        </Button>
      </div>
    </div>
  );
};
