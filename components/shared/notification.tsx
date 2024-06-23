import { FC } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

import { Bell, BellRing } from 'lucide-react';

import { InviteNotification } from '@prisma/client';

interface NotificationProps {
  notification: InviteNotification[] | null;
}

export const Notification: FC<NotificationProps> = ({ notification }) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" className="rounded-full">
          {notification && notification.length > 0 ? (
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
      <PopoverContent className="w-80">
        <div className="flex h-10 flex-col items-center justify-center">
          {notification && notification.length > 0 ? (
            notification.map((notification) => <p>{notification.id}</p>)
          ) : (
            <p>Brak powiadomień</p>
          )}
        </div>

        {/* [Osoba] zaprasza Cię do dołączenia do grupowego budżetu na platformie [Nazwa Aplikacji]. */}

        {/* <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Dimensions</h4>
            <p className="text-sm text-muted-foreground">
              Set the dimensions for the layer.
            </p>
          </div>
          <div className="grid gap-2">
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="width">Width</Label>
              <Input id="width" defaultValue="100%" className="col-span-2 h-8" />
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="maxWidth">Max. width</Label>
              <Input id="maxWidth" defaultValue="300px" className="col-span-2 h-8" />
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="height">Height</Label>
              <Input id="height" defaultValue="25px" className="col-span-2 h-8" />
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="maxHeight">Max. height</Label>
              <Input id="maxHeight" defaultValue="none" className="col-span-2 h-8" />
            </div>
          </div>
        </div> */}
      </PopoverContent>
    </Popover>
  );
};
