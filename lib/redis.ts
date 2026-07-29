import Redis from "ioredis";

import { serverEnv } from "@/config/env";

/**
 * طبقة التخزين المؤقت اختيارية.
 * لا يتم الاتصال بـ Redis إلا عند تفعيل REDIS_ENABLED.
 */
let redisInstance: Redis | null = null;

export function getRedis(): Redis | null {
  if (!serverEnv.REDIS_ENABLED) return null;

  if (!redisInstance) {
    redisInstance = new Redis(
      serverEnv.REDIS_URL ?? "redis://localhost:6379",
      {
        lazyConnect: true,
        maxRetriesPerRequest: 2,
      }
    );
  }

  return redisInstance;
}

export async function cacheGet<T>(key: string): Promise<T | null> {
  const redis = getRedis();

  if (!redis) return null;

  const value = await redis.get(key);

  return value ? (JSON.parse(value) as T) : null;
}

export async function cacheSet(
  key: string,
  value: unknown,
  ttlSeconds = 300
): Promise<void> {
  const redis = getRedis();

  if (!redis) return;

  await redis.set(key, JSON.stringify(value), "EX", ttlSeconds);
}
