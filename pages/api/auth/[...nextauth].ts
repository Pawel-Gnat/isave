import NextAuth, { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import bcrypt from 'bcrypt';

import prisma from '@/lib/prisma';

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      id: 'credentials',
      credentials: {
        email: {
          label: 'email',
          type: 'text',
        },
        password: {
          label: 'password',
          type: 'password',
        },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          throw new Error('Invalid credentials');
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        });

        if (!user) {
          throw new Error('Invalid credentials');
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.hashedPassword,
        );

        if (!isPasswordValid) {
          throw new Error('Please validate credentials');
        }

        return user;
      },
    }),
  ],
  debug: process.env.NODE_ENV === 'production',
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/auth',
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);
