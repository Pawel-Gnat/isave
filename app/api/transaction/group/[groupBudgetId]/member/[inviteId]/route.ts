import { NextResponse } from 'next/server';

import prisma from '@/lib/prisma';

import getCurrentUser from '@/actions/getCurrentUser';
import getUserById from '@/actions/getUserById';

interface ParamsProps {
  groupBudgetId: string;
}

export async function DELETE(request: Request, { params }: { params: ParamsProps }) {
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

  const invitedUser = await getUserById(inviteId);

  if (!invitedUser) {
    return NextResponse.json({ error: 'Zweryfikuj numer ID' }, { status: 404 });
  }

  await prisma.inviteNotification.create({
    data: {
      userId: inviteId,
      groupBudgetId: groupBudgetId,
      status: 'pending',
    },
  });

  return NextResponse.json('Usunięto użytkownika');
}

//   const currentUser = await getCurrentUser();

//   if (!currentUser) {
//     return NextResponse.json({ error: 'Dostęp nieupoważniony' }, { status: 401 });
//   }

//   const groupBudget = await prisma.groupBudget.findUnique({
//     where: {
//       id: groupBudgetId,
//     },
//   });

//   if (currentUser.id !== groupBudget?.ownerId) {
//     return NextResponse.json({ error: 'Dostęp nieupoważniony' }, { status: 401 });
//   }

//   const invitedUser = await getUserByInviteId(inviteId);

//   if (!invitedUser) {
//     return NextResponse.json({ error: 'Zweryfikuj numer ID' }, { status: 404 });
//   }

//   await prisma.inviteNotification.create({
//     data: {
//       userId: invitedUser.id,
//       groupBudgetId: groupBudgetId,
//       status: 'pending',
//     },
//   });
