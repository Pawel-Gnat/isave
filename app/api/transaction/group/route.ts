import { NextResponse } from 'next/server';

import prisma from '@/lib/prisma';

import getCurrentUser from '@/actions/getCurrentUser';

import capitalizeFirstLetter from '@/utils/capitalizeFirstLetter';

export async function POST(request: Request) {
  const body = await request.json();
  const { name } = body;

  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.json({ error: 'Dostęp nieupoważniony' }, { status: 401 });
  }

  await prisma.groupBudget.create({
    data: {
      name: capitalizeFirstLetter(name),
      ownerId: currentUser.id,
    },
  });

  return NextResponse.json('Utworzono nowy budżet');
}
