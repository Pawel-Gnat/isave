import { FC } from 'react';

import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

import { Notification } from './notification';

import { Bell, BellRing } from 'lucide-react';

import { ModifiedInviteNotification } from '@/types/types';

interface NotificationContainerProps {
  notifications: ModifiedInviteNotification[] | null;
}

export const NotificationContainer: FC<NotificationContainerProps> = ({
  notifications,
}) => {
  // const owner = await getUserByOwnerId(notification.groupBudget.ownerId);
  // const groupBudget = (await getGroupBudgetById(
  //   notification.groupBudget.id,
  // )) as GroupBudget;

  // if (!owner || !groupBudget) {
  //   return;
  // }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" className="rounded-full">
          {notifications && notifications.length > 0 ? (
            <div className="relative">
              <BellRing className="text-red-500" />
              <span className="absolute flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex h-3 w-3 rounded-full bg-red-500"></span>
              </span>
            </div>
          ) : (
            <Bell />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72">
        <div className="flex flex-col items-center justify-center">
          {notifications && notifications.length > 0 ? (
            notifications.map((notification) => (
              <Notification key={notification.id} notification={notification} />
            ))
          ) : (
            <p>Brak powiadomień</p>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};
