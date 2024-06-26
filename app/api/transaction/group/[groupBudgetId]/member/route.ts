import { NextResponse } from 'next/server';

import prisma from '@/lib/prisma';

import getCurrentUser from '@/actions/getCurrentUser';
import getUserByInviteId from '@/actions/getUserByInviteId';

interface ParamsProps {
  groupBudgetId: string;
}

export async function POST(request: Request, { params }: { params: ParamsProps }) {
  const body = await request.json();
  const { groupBudgetId } = params;
  const { inviteId } = body;

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
    return NextResponse.json({ error: 'Nie możesz zaprosić siebie' }, { status: 403 });
  }

  const existingInvitation = await prisma.inviteNotification.findFirst({
    where: {
      userId: invitedUser.id,
      groupBudgetId: groupBudgetId,
    },
  });

  if (existingInvitation) {
    return NextResponse.json({ error: 'Już wysłano zaproszenie' }, { status: 400 });
  }

  await prisma.inviteNotification.create({
    data: {
      userId: invitedUser.id,
      groupBudgetId: groupBudgetId,
    },
  });

  return NextResponse.json('Wysłano zaproszenie');
}
