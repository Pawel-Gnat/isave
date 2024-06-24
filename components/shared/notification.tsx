import { FC } from 'react';

import getUserByOwnerId from '@/actions/getUserByOwnerId';
import getGroupBudgetById from '@/actions/getGroupBudgetById';

import { ModifiedInviteNotification } from '@/types/types';
import { GroupBudget } from '@prisma/client';

interface NotificationProps {
  notification: ModifiedInviteNotification;
}

export const Notification: FC<NotificationProps> = async ({ notification }) => {
  const owner = await getUserByOwnerId(notification.groupBudget.ownerId);
  const groupBudget = (await getGroupBudgetById(
    notification.groupBudget.id,
  )) as GroupBudget;

  if (!owner || !groupBudget) {
    return;
  }

  return (
    <div className="p-2">
      <p>
        <span className="font-bold">{owner.name}</span> zaprasza do dołączenia do
        grupowego budżetu <span className="font-bold">{groupBudget.name}</span>
      </p>
    </div>
  );
};
