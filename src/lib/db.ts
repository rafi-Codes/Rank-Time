// src/lib/db.ts
import { MongoClient, type MongoClientOptions } from 'mongodb';
import mongoose from 'mongoose';

const options: MongoClientOptions = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  maxIdleTimeMS: 30000,
  tls: true,
  tlsInsecure: process.env.NODE_ENV === 'development', // Only for dev
  retryWrites: true,
};

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
  // eslint-disable-next-line no-var
  var _mongooseConn: Promise<typeof mongoose> | undefined;
  // eslint-disable-next-line no-var
  var _challengeSchedulerInitialized: boolean | undefined;
}

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

function getMongoUri() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
  }
  return uri;
}

function getClientPromise() {
  if (!clientPromise) {
    if (!global._mongoClientPromise) {
      client = new MongoClient(getMongoUri(), options);
      global._mongoClientPromise = client.connect();
    }
    clientPromise = global._mongoClientPromise;
  }

  return clientPromise;
}

export async function connectToDatabase() {
  try {
    const client = await getClientPromise();
    return client;
  } catch (error) {
    console.error('Database connection error:', error);
    throw new Error(`Failed to connect to database: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Mongoose connection for models — cached on global to avoid multiple connections in serverless
export default async function connectDB() {
  if (global._mongooseConn) {
    return global._mongooseConn;
  }

  global._mongooseConn = (async () => {
    try {
      return await mongoose.connect(getMongoUri());
    } catch (error) {
      console.error('Mongoose connection error:', error);
      global._mongooseConn = undefined;
      throw error;
    }
  })();

  return global._mongooseConn;
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
