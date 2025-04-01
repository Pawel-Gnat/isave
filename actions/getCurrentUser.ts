import { auth } from '@/lib/auth';

import prisma from '@/lib/prisma';

const getCurrentUser = async () => {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return null;
    }

    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email as string,
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

export default getCurrentUser;
