import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';

import prisma from '@/lib/prisma';

import { RegisterFormSchema } from '@/utils/formValidations';

export async function POST(request: Request) {
  const baseUrl = 'https://isave-ten.vercel.app';
  const baseEmail = 'p.gnat91@gmail.com';
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

  const transport = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: baseEmail,
      pass: process.env.EMAIL_KEY,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  const mailOptions: Mail.Options = {
    from: `iSave App <${baseEmail}>`,
    to: email,
    subject: `iSave link aktywacyjny`,
    html: `
    <h1>Cześć, ${name}!</h1>
    <br />
    <p>Kliknij w link aktywacyjny, aby uzyskać dostęp do aplikacji.</p>
    <br />
    <p>
      <strong>
        <a href="${baseUrl}/activate/${user.id}">Aktywuj konto</a>
      </strong>
    </p>
    <br />
    <p>
      Aplikacja nie jest produktem komercyjnym, 
      <strong>nie zbieram informacji o Twoich danych osobowych</strong>. Aplikacja służy
      wyłącznie dla rozwoju jako programista.
    </p>
    <br />
    <p>Aktywując konto wyrażasz zgodę na testowy udział w rozwoju aplikacji.</p>
    <br />
    <p>Jeśli wiadomość trafiła do Ciebie przez pomyłkę, proszę zignoruj ją.</p>
  `,
  };

  const sendMailPromise = () =>
    new Promise<string>((resolve, reject) => {
      transport.sendMail(mailOptions, function (err) {
        if (!err) {
          resolve('Wysłano link aktywacyjny');
        } else {
          console.log(err);
          reject(err.message);
        }
      });
    });

  try {
    const message = await sendMailPromise();
    return NextResponse.json(message);
  } catch (err) {
    return NextResponse.json({ error: 'Błąd wysłania wiadomości' }, { status: 500 });
  }
}
