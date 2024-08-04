import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import { google } from 'googleapis';
import { captureException } from '@sentry/nextjs';

import prisma from '@/lib/prisma';

import { RegisterFormSchema } from '@/utils/formValidations';
import { logError } from '@/utils/errorUtils';

export async function POST(request: Request) {
  const baseUrl = 'https://isave-ten.vercel.app';
  const OAuth2 = google.auth.OAuth2;
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

  const oauth2Client = new OAuth2(
    process.env.OAUTH_CLIENT_ID,
    process.env.OAUTH_CLIENT_SECRET,
    'https://developers.google.com/oauthplayground',
  );

  oauth2Client.setCredentials({
    refresh_token: process.env.OAUTH_REFRESH_TOKEN,
  });

  const accessToken = oauth2Client.getAccessToken();

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: process.env.OAUTH_EMAIL,
      clientId: process.env.OAUTH_CLIENT_ID,
      clientSecret: process.env.OAUTH_CLIENT_SECRET,
      refreshToken: process.env.OAUTH_REFRESH_TOKEN,
      accessToken: accessToken.toString(),
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  const mailOptions: Mail.Options = {
    from: `iSave App <${process.env.OAUTH_EMAIL}>`,
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
      transporter.sendMail(mailOptions, function (err) {
        if (!err) {
          resolve('Wysłano link aktywacyjny');
        } else {
          logError(() => captureException(`Backend - send email failed: ${err}`), err);
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
