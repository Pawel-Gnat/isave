import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import prisma from '@/lib/prisma';
import { nextCookies } from 'better-auth/next-js';
import { hashPassword, verifyPassword } from './auth-helpers';

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  database: prismaAdapter(prisma, {
    provider: 'mongodb',
  }),
  account: {
    fields: {
      accountId: 'providerAccountId',
      refreshToken: 'refresh_token',
      accessToken: 'access_token',
      idToken: 'id_token',
    },
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    password: {
      hash: async (password: string) => {
        return await hashPassword(password);
      },
      verify: async ({ password, hash }: { password: string; hash: string }) => {
        return await verifyPassword(password, hash);
      },
    },
  },
  pages: {
    signIn: '/auth',
  },
  secret: process.env.BETTER_AUTH_SECRET,
  plugins: [nextCookies()],
});
