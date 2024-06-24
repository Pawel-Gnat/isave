'use server';

import prisma from '@/lib/prisma';

const getUserByInviteId = async (inviteId: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        inviteId,
      },
    });

    if (!user) {
      return null;
    }

    return user;
  } catch (error) {
    return null;
  }
};

export default getUserByInviteId;
