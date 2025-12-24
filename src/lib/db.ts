// src/lib/db.ts
import { MongoClient } from 'mongodb';
import mongoose from 'mongoose';

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

const uri = process.env.MONGODB_URI;
const options = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
};

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
  // eslint-disable-next-line no-var
  var _mongooseConn: Promise<typeof mongoose> | undefined;
}

let client = new MongoClient(uri, options);
let clientPromise: Promise<MongoClient>;

if (!global._mongoClientPromise) {
  global._mongoClientPromise = client.connect();
}
clientPromise = global._mongoClientPromise;

export async function connectToDatabase() {
  try {
    const client = await clientPromise;
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
      return await mongoose.connect(uri);
    } catch (error) {
      console.error('Mongoose connection error:', error);
      global._mongooseConn = undefined;
      throw error;
    }
  })();

  return global._mongooseConn;
}