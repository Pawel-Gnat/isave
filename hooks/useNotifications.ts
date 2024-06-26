import { useQuery } from '@tanstack/react-query';

import getInviteNotifications from '@/actions/getInviteNotifications';

export default function useNotifications(id: string) {
  const {
    data: notifications,
    isLoading: isNotificationsLoading,
    error: notificationsError,
    refetch: notificationsRefetch,
  } = useQuery({
    queryKey: ['notifications', id],
    queryFn: async () => await getInviteNotifications(id),
  });

  return {
    notifications,
    isNotificationsLoading,
    notificationsError,
    notificationsRefetch,
  };
}
