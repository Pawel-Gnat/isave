import Credentials from 'next-auth/providers/credentials';
import type { NextAuthConfig } from 'next-auth';
import bcrypt from 'bcryptjs';

import { LoginFormSchema } from '@/utils/formValidations';
import prisma from './lib/prisma';
import { SessionUser } from './types/types';

export default {
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
            throw new Error('Konto nie istnieje');
          }

          const isPasswordValid = await bcrypt.compare(password, user.hashedPassword);

          if (!isPasswordValid) {
            throw new Error('Zweryfikuj dane');
          }

          if (!user.emailVerified) {
            throw new Error('Konto nie jest aktywne');
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            inviteId: user.inviteId,
            apiCallLimit: user.apiCallLimit,
          } satisfies SessionUser;
        }

        throw new Error('Nieprawidłowe dane logowania');
      },
    }),
  ],
} satisfies NextAuthConfig;
