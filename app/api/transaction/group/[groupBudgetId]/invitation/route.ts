import { NextResponse } from 'next/server';

import prisma from '@/lib/prisma';

import getCurrentUser from '@/actions/getCurrentUser';

interface ParamsProps {
  groupBudgetId: string;
}

export async function POST(request: Request, { params }: { params: ParamsProps }) {
  const body = await request.json();
  const { groupBudgetId } = params;
  const { userId } = body;

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

  await prisma.groupBudgetMember.create({
    data: {
      userId: userId,
      groupBudgetId: groupBudgetId,
    },
  });

  return NextResponse.json('Zaakceptowano zaproszenie');
}
