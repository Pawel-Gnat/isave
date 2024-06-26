import { NextResponse } from 'next/server';

import prisma from '@/lib/prisma';

import getCurrentUser from '@/actions/getCurrentUser';
import getUserByInviteId from '@/actions/getUserByInviteId';

interface ParamsProps {
  groupBudgetId: string;
  inviteId: string;
}

export async function DELETE(request: Request, { params }: { params: ParamsProps }) {
  const { groupBudgetId, inviteId } = params;

  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.json({ error: 'Dostęp nieupoważniony' }, { status: 401 });
  }

  const groupBudget = await prisma.groupBudget.findUnique({
    where: {
      id: groupBudgetId,
    },
  });

  if (currentUser.id !== groupBudget?.ownerId) {
    return NextResponse.json({ error: 'Dostęp nieupoważniony' }, { status: 401 });
  }

  const invitedUser = await getUserByInviteId(inviteId);

  if (!invitedUser) {
    return NextResponse.json({ error: 'Zweryfikuj numer ID' }, { status: 404 });
  }

  if (currentUser.id === invitedUser.id) {
    return NextResponse.json({ error: 'Nie możesz usunąć siebie' }, { status: 403 });
  }

  // await prisma.inviteNotification.create({
  //   data: {
  //     userId: inviteId,
  //     groupBudgetId: groupBudgetId,
  //   },
  // });

  return NextResponse.json('Usunięto użytkownika');
}
