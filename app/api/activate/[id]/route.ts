import { NextResponse } from 'next/server';

import prisma from '@/lib/prisma';

interface ParamsProps {
  id: string;
}

export async function PATCH(request: Request, { params }: { params: ParamsProps }) {
  const { id } = params;

  const user = await prisma.user.findUnique({
    where: {
      id,
    },
  });

  if (!user) {
    return NextResponse.json({ error: 'Dostęp nieupoważniony' }, { status: 404 });
  }

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      emailVerified: true,
    },
  });

  return NextResponse.json('Aktywowano konto');
}
