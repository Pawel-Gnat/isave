import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import prisma from '@/lib/prisma';
import authConfig from '@/auth.config';
import getUserById from '@/actions/getUserById';

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  callbacks: {
    async signIn({ user }) {
      if (!user.id) {
        return false;
      }

      const existingUser = await getUserById(user.id);

      if (!existingUser || !existingUser.emailVerified) {
        throw new Error('Konto nie jest aktywne');
      }

      return true;
    },
    async session({ token, session }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      if (token.inviteId && session.user) {
        session.user.inviteId = token.inviteId;
      }

      return session;
    },
    async jwt({ token }) {
      if (!token.sub) return token;

      const user = await getUserById(token.sub);
      if (!user) return token;

      token.inviteId = user.inviteId;
      return token;
    },
  },
  session: { strategy: 'jwt' },
  ...authConfig,
});
