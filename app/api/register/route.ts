import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import bcrypt from 'bcrypt';

import prisma from '@/lib/prisma';

import { RegisterFormSchema } from '@/utils/formValidations';

import { EmailTemplate } from '@/components/email/email';

const resend = new Resend(process.env.RESEND_API_KEY);

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
  const user = await prisma.user.create({
    data: {
      inviteId: crypto.randomUUID(),
      name,
      email,
      hashedPassword,
      emailVerified: process.env.NEXT_ENV !== 'production',
    },
  });

  if (!user) {
    return NextResponse.json({ error: 'Błąd tworzenia konta' }, { status: 500 });
  }

  if (process.env.NEXT_ENV !== 'production') {
    return NextResponse.json('Konto testowe utworzone');
  }

  const { error } = await resend.emails.send({
    from: 'iSave <onboarding@resend.dev>',
    to: [email],
    subject: 'Link aktywacyjny',
    react: EmailTemplate({ name, id: user.id }),
  });

  if (error) {
    return NextResponse.json({ error: 'Błąd wysłania wiadomości' }, { status: 400 });
  }

  return NextResponse.json('Wysłano link aktywacyjny');
}
