// src/lib/auth.ts
import { hash, compare } from 'bcryptjs';
import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { connectToDatabase } from '@/lib/db';

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

        console.log('NextAuth authorize called for:', credentials.email);

        let client;
        try {
          client = await connectToDatabase();
          const db = client.db();

          const user = await db.collection('users').findOne({
            email: credentials.email,
          });

          console.log('User found:', !!user);

          if (!user) {
            console.log('No user found for email:', credentials.email);
            throw new Error('No user found!');
          }

          if (user.verified === false) {
            console.log('User not verified:', credentials.email);
            throw new Error('Email not verified');
          }

          const isValid = await verifyPassword(
            credentials.password,
            user.password
          );

          console.log('Password valid:', isValid);

          if (!isValid) {
            console.log('Invalid password for:', credentials.email);
            throw new Error('Invalid password!');
          }

          console.log('Login successful for:', credentials.email);

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
        // Don't close client in serverless - let connection pool handle it
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
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: true, // Always secure in production
      },
    },
  },
  callbacks: {
    async jwt({ token, user, account }) {
      try {
        console.log('JWT callback called', { hasUser: !!user, hasAccount: !!account, tokenSub: token.sub });
        // Persist the OAuth access_token and or the user id to the token right after signin
        if (account) {
          token.accessToken = account.access_token;
        }
        if (user) {
          token.id = user.id;
          token.email = user.email;
          token.name = user.name;
          token.picture = user.image;
        }
        return token;
      } catch (err) {
        console.error('NextAuth jwt callback error:', err);
        throw err;
      }
    },
    async session({ session, token }) {
      try {
        console.log('Session callback called', { hasToken: !!token, tokenId: token.id });
        // Send properties to the client, like an access_token and user id from a provider
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