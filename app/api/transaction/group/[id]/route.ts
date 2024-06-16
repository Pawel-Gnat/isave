import { NextResponse } from 'next/server';

import prisma from '@/lib/prisma';

import getCurrentUser from '@/actions/getCurrentUser';

interface ParamsProps {
  id: string;
}

export async function DELETE(request: Request, { params }: { params: ParamsProps }) {
  const { id } = params;

  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.json({ error: 'Dostęp nieupoważniony' }, { status: 401 });
  }

  await prisma.groupBudget.delete({
    where: {
      id: id,
      ownerId: currentUser.id,
    },
  });

  return NextResponse.json('Usunięto grupowy budżet');
}
