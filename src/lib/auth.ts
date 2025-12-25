// src/lib/auth.ts
import { hash, compare } from 'bcryptjs';
import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { connectToDatabase } from '@/lib/db';

export const authOptions: NextAuthOptions = {
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

        let client;
        try {
          if (process.env.DEBUG_AUTH === 'true') {
            // do not log passwords
            // eslint-disable-next-line no-console
            console.debug('Authorize attempt for:', { email: credentials.email });
          }
          client = await connectToDatabase();
          const db = client.db();

          const user = await db.collection('users').findOne({
            email: credentials.email,
          });

          if (process.env.DEBUG_AUTH === 'true') {
            // eslint-disable-next-line no-console
            console.debug('User lookup result:', !!user);
          }
          if (!user) {
            throw new Error('No user found!');
          }

          if (user.verified === false) {
            throw new Error('Email not verified');
          }

          const isValid = await verifyPassword(
            credentials.password,
            user.password
          );

          if (!isValid) {
            throw new Error('Invalid password!');
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
        secure: process.env.NODE_ENV === 'production', // true in production, false in development
        maxAge: 30 * 24 * 60 * 60, // 30 days
      },
    },
    callbackUrl: {
      name: `next-auth.callback-url`,
      options: {
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 30 * 24 * 60 * 60,
      },
    },
    csrfToken: {
      name: 'next-auth.csrf-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 30 * 24 * 60 * 60,
      },
    },
  },
  callbacks: {
    async jwt({ token, user, account }) {
      try {
        // Persist the OAuth access_token and or the user id to the token right after signin
        if (account) {
          token.accessToken = account.access_token;
        }
        if (user) {
          token.id = user.id;
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
        // Send properties to the client, like an access_token and user id from a provider
        if (token) {
          // protect against unexpected shapes
          try {
            session.user.id = (token as any).id as string;
            session.user.image = (token as any).picture as string;
          } catch (inner) {
            console.warn('Unable to attach token props to session:', inner);
          }
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