import { NextResponse } from 'next/server';

import prisma from '@/lib/prisma';

import getCurrentUser from '@/actions/getCurrentUser';

interface ParamsProps {
  groupBudgetId: string;
  userId: string;
}

export async function DELETE(request: Request, { params }: { params: ParamsProps }) {
  const { groupBudgetId, userId } = params;

  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.json({ error: 'Dostęp nieupoważniony' }, { status: 401 });
  }

  const inviteNotification = await prisma.inviteNotification.findFirst({
    where: {
      groupBudgetId: groupBudgetId,
      userId: userId,
    },
  });

  if (!inviteNotification) {
    return NextResponse.json({ error: 'Dostęp nieupoważniony' }, { status: 400 });
  }

  await prisma.inviteNotification.delete({
    where: {
      id: inviteNotification.id,
    },
  });

  return NextResponse.json('Odrzucono zaproszenie');
}
