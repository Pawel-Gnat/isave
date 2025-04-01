import Credentials from 'next-auth/providers/credentials';
import { CredentialsSignin, type NextAuthConfig } from 'next-auth';
import bcrypt from 'bcryptjs';

import { LoginFormSchema } from '@/utils/formValidations';
import prisma from './lib/prisma';
import { SessionUser } from './types/types';

class CustomError extends CredentialsSignin {
  constructor(code: string) {
    super(code);
    this.code = code;
  }
}

export default {
  pages: {
    signIn: '/auth',
  },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    Credentials({
      async authorize(credentials) {
        const validatedFields = LoginFormSchema.safeParse(credentials);

        if (validatedFields.success) {
          const { email, password } = validatedFields.data;

          const user = await prisma.user.findUnique({
            where: {
              email,
            },
          });

          if (!user) {
            throw new CustomError('Konto nie istnieje');
          }

          const isPasswordValid = await bcrypt.compare(password, user.hashedPassword);

          if (!isPasswordValid) {
            throw new CustomError('Zweryfikuj dane');
          }

          if (!user.emailVerified) {
            throw new CustomError('Konto nie jest aktywne');
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            inviteId: user.inviteId,
            apiCallLimit: user.apiCallLimit,
          } satisfies SessionUser;
        }

        throw new CustomError('Nieprawidłowe dane logowania');
      },
    }),
  ],
} satisfies NextAuthConfig;
