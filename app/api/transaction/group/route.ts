import { NextResponse } from 'next/server';

import prisma from '@/lib/prisma';

import getCurrentUser from '@/actions/getCurrentUser';

import { capitalizeFirstLetter } from '@/utils/textUtils';
import { CreateBudgetFormSchema } from '@/utils/formValidations';

export async function POST(request: Request) {
  const body = await request.json();

  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.json({ error: 'Dostęp nieupoważniony' }, { status: 401 });
  }

  const validationResult = CreateBudgetFormSchema.safeParse(body);

  if (!validationResult.success) {
    return NextResponse.json({ error: 'Niepoprawna nazwa' }, { status: 400 });
  }

  const { name } = validationResult.data;

  await prisma.groupBudget.create({
    data: {
      name: capitalizeFirstLetter(name),
      ownerId: currentUser.id,
    },
  });

  return NextResponse.json('Utworzono nowy budżet');
}
