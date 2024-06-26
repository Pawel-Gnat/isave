'use client';

import { FC } from 'react';

import useNotifications from '@/hooks/useNotifications';

import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

import { Notification } from './notification';

import { Bell, BellRing } from 'lucide-react';

interface NotificationContainerProps {
  userId: string;
}

export const NotificationContainer: FC<NotificationContainerProps> = ({ userId }) => {
  const { notifications, isNotificationsLoading } = useNotifications(userId);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" className="rounded-full">
          {isNotificationsLoading ? (
            <Bell />
          ) : notifications && notifications.length > 0 ? (
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
          {isNotificationsLoading ? (
            <p>Ładowanie</p>
          ) : notifications && notifications.length > 0 ? (
            notifications.map((notification) => (
              <Notification
                key={notification.id}
                notification={notification}
                userId={userId}
              />
            ))
          ) : (
            <p>Brak powiadomień</p>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};
