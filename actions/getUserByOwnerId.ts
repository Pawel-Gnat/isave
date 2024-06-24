'use server';

import prisma from '@/lib/prisma';

const getUserByOwnerId = async (ownerId: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: ownerId,
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

export default getUserByOwnerId;
