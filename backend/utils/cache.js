import Redis from 'ioredis';

const redisUrl = process.env.REDIS_URL;
const redis = redisUrl ? new Redis(redisUrl, { maxRetriesPerRequest: 1 }) : null;
const memoryCache = new Map();

export const getCache = async (key) => {
  if (redis) {
    const value = await redis.get(key);
    return value ? JSON.parse(value) : null;
  }
  const item = memoryCache.get(key);
  if (!item || item.expiresAt < Date.now()) return null;
  return item.value;
};

export const setCache = async (key, value, ttlSeconds = 600) => {
  if (redis) {
    await redis.set(key, JSON.stringify(value), 'EX', ttlSeconds);
    return;
  }
  memoryCache.set(key, { value, expiresAt: Date.now() + ttlSeconds * 1000 });
};
