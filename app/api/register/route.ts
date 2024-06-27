import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';

import prisma from '@/lib/prisma';

import { RegisterFormSchema } from '@/utils/formValidations';
import { capitalizeFirstLetter } from '@/utils/textUtils';

export async function POST(request: Request) {
  const body = await request.json();

  const validationResult = RegisterFormSchema.safeParse(body);

  if (!validationResult.success) {
    return NextResponse.json({ error: 'Niepoprawne dane rejestracji' }, { status: 400 });
  }

  const { name, email, password } = validationResult.data;

  const existingUser = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  if (existingUser) {
    return NextResponse.json(
      { error: 'Podany e-mail jest już zarejestrowany' },
      { status: 409 },
    );
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  await prisma.user.create({
    data: {
      inviteId: crypto.randomUUID(),
      name: capitalizeFirstLetter(name),
      email,
      hashedPassword,
    },
  });

  return NextResponse.json('Konto pomyślnie utworzone');
}
