// src/lib/auth.ts
import { hash, compare } from 'bcryptjs';
import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GitHubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';
import { connectToDatabase } from '@/lib/db';
import { generateUserTag, normalizeEmail } from '@/lib/utils';
import type { Db } from 'mongodb';

async function generateUniqueUserTag(db: Db) {
  let usertag = generateUserTag();
  let attempts = 0;

  while (await db.collection('users').findOne({ usertag })) {
    usertag = generateUserTag();
    attempts += 1;

    if (attempts > 10) {
      throw new Error('Failed to generate unique usertag');
    }
  }

  return usertag;
}

async function getOrCreateOAuthUser(profile: {
  email?: string | null;
  name?: string | null;
  image?: string | null;
}) {
  if (!profile.email) {
    throw new Error('OAuth account does not expose a verified email address');
  }

  const email = normalizeEmail(profile.email);
  const client = await connectToDatabase();
  const db = client.db();
  const users = db.collection('users');
  const existingUser = await users.findOne({ email });

  if (existingUser) {
    const updates: Record<string, unknown> = {
      verified: true,
      emailVerified: existingUser.emailVerified || new Date(),
      updatedAt: new Date(),
    };

    if (profile.name && profile.name !== existingUser.name) updates.name = profile.name;
    if (profile.image && profile.image !== existingUser.image) updates.image = profile.image;

    if (!existingUser.usertag) {
      updates.usertag = await generateUniqueUserTag(db);
    }

    await users.updateOne({ _id: existingUser._id }, { $set: updates });

    return {
      ...existingUser,
      ...updates,
    };
  }

  const now = new Date();
  const result = await users.insertOne({
    name: profile.name || email.split('@')[0],
    email,
    image: profile.image || null,
    verified: true,
    emailVerified: now,
    usertag: await generateUniqueUserTag(db),
    following: [],
    totalScore: 0,
    currentStreak: 0,
    maxStreak: 0,
    league: 'bronze',
    rank: 0,
    totalSessions: 0,
    createdAt: now,
    updatedAt: now,
  });

  return users.findOne({ _id: result.insertedId });
}

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
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          }),
        ]
      : []),
    ...(process.env.GITHUB_ID && process.env.GITHUB_SECRET
      ? [
          GitHubProvider({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET,
            authorization: {
              params: {
                scope: 'read:user user:email',
              },
            },
          }),
        ]
      : []),
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
    async signIn({ user, account }) {
      if (account?.provider === 'google' || account?.provider === 'github') {
        await getOrCreateOAuthUser({
          email: user.email,
          name: user.name,
          image: user.image,
        });
      }

      return true;
    },
    async jwt({ token, user, account }) {
      try {
        if (user) {
          if (account?.provider === 'google' || account?.provider === 'github') {
            const dbUser = await getOrCreateOAuthUser({
              email: user.email,
              name: user.name,
              image: user.image,
            });

            if (!dbUser) {
              throw new Error('Failed to load OAuth user');
            }

            token.id = dbUser._id.toString();
          } else {
            token.id = user.id;
          }

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
