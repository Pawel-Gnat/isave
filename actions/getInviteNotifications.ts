'use server';

import prisma from '@/lib/prisma';

import getCurrentUser from './getCurrentUser';

const getInviteNotifications = async (id: string) => {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return null;
    }

    const inviteNotification = await prisma.inviteNotification.findMany({
      where: {
        userId: id,
        status: 'pending',
      },
      include: {
        groupBudget: true,
      }
    });

    if (!inviteNotification) {
      return null;
    }

    return inviteNotification;
  } catch (error) {
    return null;
  }
};

export default getInviteNotifications;
