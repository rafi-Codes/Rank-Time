// test-db.js
const { MongoClient } = require('mongodb');
const fs = require('fs');

// Load .env.local manually
if (fs.existsSync('.env.local')) {
  const envContent = fs.readFileSync('.env.local', 'utf8');
  envContent.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split('=');
    if (key && valueParts.length > 0) {
      const value = valueParts.join('=').trim();
      if (value.startsWith('"') && value.endsWith('"')) {
        process.env[key.trim()] = value.slice(1, -1);
      } else {
        process.env[key.trim()] = value;
      }
    }
  });
}

async function testConnection() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('❌ MONGODB_URI not found in environment variables');
    return;
  }

  const options = {
    // Using minimal options to let MongoDB driver handle SSL automatically
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  };

  console.log('Testing MongoDB connection...');
  console.log('URI:', uri.replace(/:([^:@]{4})[^:@]*@/, ':$1****@')); // Hide password

  try {
    const client = new MongoClient(uri, options);
    console.log('Connecting...');
    await client.connect();
    console.log('✅ Connected successfully!');

    const db = client.db();
    const collections = await db.collections();
    console.log('Available collections:', collections.map(c => c.collectionName));

    await client.close();
    console.log('✅ Connection closed successfully');
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    console.error('Full error:', error);
  }
}

testConnection();