import Redis from "ioredis";

import { serverEnv } from "@/config/env";

/**
 * طبقة التخزين المؤقت (Cache) — اختيارية في هذه المرحلة.
 * يبقى العميل غير متصل حتى تُفعَّل REDIS_ENABLED صراحة في .env، حتى لا
 * يفشل التشغيل المحلي لمن لا يملك Redis بعد.
 *
 * Cache layer — optional in this phase.
 * The client stays disconnected until REDIS_ENABLED is explicitly set in
 * .env, so local runs don't fail for developers without Redis yet.
 */

let redisInstance: Redis | null = null;

export function getRedis(): Redis | null {
  if (!serverEnv.REDIS_ENABLED) return null;
  if (!redisInstance) {
    redisInstance = new Redis(serverEnv.REDIS_URL ?? "redis://localhost:6379", {
      lazyConnect: true,
      maxRetriesPerRequest: 2,
    });
  }
  return redisInstance;
}

export async function cacheGet<T>(key: string): Promise<T | null> {
  const redis = getRedis();
  if (!redis) return null;
  const value = await redis.get(key);
  return value ? (JSON.parse(value) as T) : null;
}

export async function cacheSet(key: string, value: unknown, ttlSeconds = 300): Promise<void> {
  const redis = getRedis();
  if (!redis) return;
  await redis.set(key, JSON.stringify(value), "EX", ttlSeconds);
}
