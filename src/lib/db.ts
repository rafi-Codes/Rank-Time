// src/lib/db.ts
import mongoose, { type ConnectOptions } from 'mongoose';

const options: ConnectOptions = {
  minPoolSize: 5,
  maxPoolSize: 20,
  serverSelectionTimeoutMS: 10000,
  socketTimeoutMS: 45000,
  maxIdleTimeMS: 30000,
  retryWrites: true,
  authSource: 'admin',
  ...(process.env.NODE_ENV === 'production' ? { tls: true } : {}),
};

declare global {
  // eslint-disable-next-line no-var
  var _mongooseConn: Promise<typeof mongoose> | undefined;
  // eslint-disable-next-line no-var
  var _challengeSchedulerInitialized: boolean | undefined;
}


function getMongoUri() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
  }
  return uri;
}

// Mongoose connection for models — cached on global to avoid multiple connections in serverless
export default async function connectDB() {

  if (global._mongooseConn) {
    return global._mongooseConn;
  }

  global._mongooseConn = (async () => {
    try {
      return await mongoose.connect(getMongoUri(), options);
    } catch (error) {
      console.error('Mongoose connection error:', error);
      global._mongooseConn = undefined;
      throw error;
    }
  })();

  return global._mongooseConn;
}

export async function isDbHealthy() {
  const conn = await connectDB();
  try {
    if (!conn.connection.db) {
      return {
        ok: false,
        error: 'No database object available',
        state: conn.connection.readyState,
      };
    }
    await conn.connection.db?.admin().ping();
    return {
      ok: true,
      state: conn.connection.readyState,
    };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : String(error),
      state: conn.connection.readyState,
    };
  }
}

// Initialize challenge scheduler when DB module is loaded
try {
  // import lazily to avoid cyclic imports during build
  // Guard with a global flag so the scheduler is only initialized once.
  // Also require explicit env var to avoid initializing during Next.js build/static rendering.
  if (process.env.ENABLE_SCHEDULER === 'true' && !global._challengeSchedulerInitialized) {
    const { initChallengeScheduler } = require('./challengeScheduler');
    if (initChallengeScheduler) {
      global._challengeSchedulerInitialized = true;
      try {
        initChallengeScheduler();
      } catch (e) {
        console.error('Failed to initialize challenge scheduler:', e);
      }
    }
  }
} catch (err) {
  // Scheduler initialization failures should not break DB connection
  // Log for debugging
  // console.error('Failed to initialize challenge scheduler:', err);
}
