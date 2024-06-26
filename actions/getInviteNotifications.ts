'use server';

import prisma from '@/lib/prisma';

import getCurrentUser from './getCurrentUser';
import getUserByOwnerId from './getUserByOwnerId';

import { ModifiedInviteNotificationWithOwner } from '@/types/types';

const getInviteNotifications = async (id: string) => {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return null;
    }

    const inviteNotifications = await prisma.inviteNotification.findMany({
      where: {
        userId: id,
      },
      include: {
        groupBudget: true,
      },
    });

    if (!inviteNotifications) {
      return null;
    }

    const notificationsWithOwner = await Promise.all(
      inviteNotifications.map(async (notification) => {
        const owner = await getUserByOwnerId(notification.groupBudget.ownerId);
        return {
          ...notification,
          owner,
        } as ModifiedInviteNotificationWithOwner;
      }),
    );

    return notificationsWithOwner;
  } catch (error) {
    return null;
  }
};

export default getInviteNotifications;
