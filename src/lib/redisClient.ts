import Redis from 'ioredis';

let redis: Redis | null = null;

export function getRedisClient() {
  if (redis) return redis;

  if (!process.env.REDIS_URL) {
    console.warn('REDIS_URL not configured; Redis caching and queues will be disabled.');
    return null;
  }

  const client = new Redis(process.env.REDIS_URL as string);
  client.on('error', (error: Error) => {
    console.error('Redis error:', error);
  });
  redis = client;
  return redis;
}

export async function redisGet(key: string) {
  const client = getRedisClient();
  if (!client) return null;
  return await client.get(key);
}

export async function redisSet(key: string, value: string, ttlSeconds?: number) {
  const client = getRedisClient();
  if (!client) return null;
  if (ttlSeconds) {
    return await client.set(key, value, 'EX', ttlSeconds);
  }
  return await client.set(key, value);
}

export async function redisDel(key: string) {
  const client = getRedisClient();
  if (!client) return null;
  return await client.del(key);
}

export async function redisIncr(key: string) {
  const client = getRedisClient();
  if (!client) return null;
  return await client.incr(key);
}

export async function redisExpire(key: string, seconds: number) {
  const client = getRedisClient();
  if (!client) return null;
  return await client.expire(key, seconds);
}
