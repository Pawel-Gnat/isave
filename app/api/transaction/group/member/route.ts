import { NextResponse } from 'next/server';

import prisma from '@/lib/prisma';

import getCurrentUser from '@/actions/getCurrentUser';
import getUserById from '@/actions/getUserById';

export async function POST(request: Request) {
  const body = await request.json();
  const { id, groupBudgetId } = body;

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

  const invitedUser = await getUserById(id);

  if (!invitedUser) {
    return NextResponse.json({ error: 'Zweryfikuj numer ID' }, { status: 404 });
  }

  await prisma.inviteNotification.create({
    data: {
      userId: id,
      groupBudgetId: groupBudgetId,
      status: 'pending',
    },
  });

  return NextResponse.json('Wysłano zaproszenie');
}
