// src/lib/auth.ts
import { hash, compare } from 'bcryptjs';
import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { connectToDatabase } from '@/lib/db';
import { normalizeEmail } from '@/lib/utils';

export const authOptions: NextAuthOptions = {
  debug: process.env.DEBUG_AUTH === 'true',
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials) return null;
        const email = normalizeEmail(credentials.email);
        const password = credentials.password?.trim() ?? '';
        if (!email || !password) {
          throw new Error('Email and password are required');
        }

        let client;
        try {
          client = await connectToDatabase();
          const db = client.db();

          const user = await db.collection('users').findOne({
            email,
          });

          if (!user) {
            throw new Error('Invalid email or password');
          }

          if (user.verified === false) {
            throw new Error('Email not verified');
          }

          if (!user.password) {
            throw new Error('Password login is not available for this account');
          }

          const isValid = await verifyPassword(password, user.password);

          if (!isValid) {
            throw new Error('Invalid email or password');
          }

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            image: user.image,
          };
        } catch (error) {
          console.error('Auth error:', error);
          throw error;
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  useSecureCookies: process.env.NODE_ENV === 'production',
  callbacks: {
    async jwt({ token, user }) {
      try {
        if (user) {
          token.id = user.id;
          token.email = user.email as string;
          token.name = user.name as string;
          token.picture = user.image as string;
        }
        return token;
      } catch (err) {
        console.error('NextAuth jwt callback error:', err);
        throw err;
      }
    },
    async session({ session, token }) {
      try {
        if (token) {
          session.user.id = token.id as string;
          session.user.email = token.email as string;
          session.user.name = token.name as string;
          session.user.image = token.picture as string;
        }
        return session;
      } catch (err) {
        console.error('NextAuth session callback error:', err);
        throw err;
      }
    },
  },
  pages: {
    signIn: '/login',
  },
};

export async function hashPassword(password: string): Promise<string> {
  return await hash(password, 12);
}

export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return await compare(password, hashedPassword);
}
