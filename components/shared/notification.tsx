'use client';

import axios from 'axios';
import { CSSProperties, useState } from 'react';
import { toast } from 'sonner';

import useNotifications from '@/hooks/useNotifications';
import useGroupBudgets from '@/hooks/useGroupBudgets';

import { Button } from '../ui/button';

import { Check, X } from 'lucide-react';
import PuffLoader from 'react-spinners/PuffLoader';

import { ModifiedInviteNotificationWithOwner } from '@/types/types';

interface NotificationProps {
  notification: ModifiedInviteNotificationWithOwner;
  userId: string;
}

const override: CSSProperties = {
  borderColor: 'var(--background) var(--background) transparent',
};

export const Notification = ({ notification, userId }: NotificationProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { groupBudgetsRefetch } = useGroupBudgets();
  const { notificationsRefetch } = useNotifications(userId);

  const handleAcceptButton = async () => {
    if (isLoading) return;
    setIsLoading(true);

    axios
      .post(`api/transaction/group/${notification.groupBudgetId}/invitation`, { userId })
      .then((response) => {
        toast.success(`${response.data}`);
        groupBudgetsRefetch();
        notificationsRefetch();
      })
      .catch((error) => {
        // toast.error(`${error.response.data.error}`);

        if (axios.isAxiosError(error)) {
          if (error.response && error.response.data) {
            toast.error(error.response.data.error);
          } else {
            toast.error('Błąd wysyłania', { description: 'Nieznany błąd' });
          }
        } else {
          toast.error('Nieznany błąd');
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleRejectButton = async () => {
    if (isLoading) return;
    setIsLoading(true);

    axios
      .delete(`api/transaction/group/${notification.groupBudgetId}/invitation/${userId}`)
      .then((response) => {
        toast.success(`${response.data}`);
        notificationsRefetch();
      })
      .catch((error) => {
        // toast.error(`${error.response.data.error}`);

        if (axios.isAxiosError(error)) {
          if (error.response && error.response.data) {
            toast.error(error.response.data.error);
          } else {
            toast.error('Błąd wysyłania', { description: 'Nieznany błąd' });
          }
        } else {
          toast.error('Nieznany błąd');
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div className="flex flex-row items-end gap-4">
      <p>
        <span className="font-bold">{notification.owner.name}</span> zaprasza do{' '}
        <span className="font-bold">{notification.groupBudget.name}</span>
      </p>
      <div className="flex gap-2">
        <Button
          size="icon"
          variant="outline"
          onClick={handleRejectButton}
          aria-label="Odrzuć zaproszenie"
        >
          {isLoading ? <PuffLoader size={20} cssOverride={override} /> : <X />}
        </Button>
        <Button
          size="icon"
          variant="outline"
          onClick={handleAcceptButton}
          aria-label="Akceptuj zaproszenie"
        >
          {isLoading ? <PuffLoader size={20} cssOverride={override} /> : <Check />}
        </Button>
      </div>
    </div>
  );
};
