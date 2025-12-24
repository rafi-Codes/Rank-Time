// src/lib/db.ts
import { MongoClient } from 'mongodb';
import mongoose from 'mongoose';

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

const uri = process.env.MONGODB_URI;
const options = {
  // Using minimal options to let MongoDB driver handle SSL automatically
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
};

let client;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise!;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export async function connectToDatabase() {
  try {
    const client = await clientPromise;
    return client;
  } catch (error) {
    console.error('Database connection error:', error);
    throw new Error(`Failed to connect to database: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Mongoose connection for models
let isConnected = false;

export default async function connectDB() {
  if (isConnected) {
    return;
  }

  try {
    await mongoose.connect(uri, {
      // Mongoose handles connection options internally
    });
    isConnected = true;
    console.log('MongoDB connected with Mongoose');
  } catch (error) {
    console.error('Mongoose connection error:', error);
    throw error;
  }
}