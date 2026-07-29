import { createHash } from "crypto";

import { getRedis } from "@/lib/redis";

export type RateLimitResult = {
  allowed: boolean;
  limit: number;
  remaining: number;
  retryAfterSeconds: number;
};

type MemoryEntry = {
  count: number;
  expiresAt: number;
};

const globalForRateLimit = globalThis as typeof globalThis & {
  rateLimitMemoryStore?: Map<string, MemoryEntry>;
};

const memoryStore =
  globalForRateLimit.rateLimitMemoryStore ??
  new Map<string, MemoryEntry>();

if (process.env.NODE_ENV !== "production") {
  globalForRateLimit.rateLimitMemoryStore = memoryStore;
}

/**
 * يحوّل البريد أو المعرّف إلى قيمة ثابتة غير قابلة للقراءة المباشرة،
 * حتى لا تُخزَّن البيانات الشخصية داخل مفاتيح Redis.
 */
export function hashRateLimitIdentifier(identifier: string): string {
  return createHash("sha256")
    .update(identifier.trim().toLowerCase())
    .digest("hex");
}

function consumeMemoryRateLimit(
  key: string,
  limit: number,
  windowSeconds: number
): RateLimitResult {
  const now = Date.now();
  const current = memoryStore.get(key);

  if (!current || current.expiresAt <= now) {
    memoryStore.set(key, {
      count: 1,
      expiresAt: now + windowSeconds * 1000,
    });

    return {
      allowed: true,
      limit,
      remaining: Math.max(limit - 1, 0),
      retryAfterSeconds: windowSeconds,
    };
  }

  current.count += 1;
  memoryStore.set(key, current);

  const retryAfterSeconds = Math.max(
    Math.ceil((current.expiresAt - now) / 1000),
    1
  );

  return {
    allowed: current.count <= limit,
    limit,
    remaining: Math.max(limit - current.count, 0),
    retryAfterSeconds,
  };
}

/**
 * عدّاد ذري في Redis باستخدام Lua:
 * - يزيد العداد.
 * - يضع مدة انتهاء عند أول محاولة.
 * - يعيد العدد والوقت المتبقي.
 *
 * عند عدم تفعيل Redis محليًا، يستخدم مخزنًا مؤقتًا داخل الذاكرة.
 */
export async function consumeRateLimit(options: {
  key: string;
  limit: number;
  windowSeconds: number;
}): Promise<RateLimitResult> {
  const { key, limit, windowSeconds } = options;

  if (limit < 1 || windowSeconds < 1) {
    throw new Error("Rate-limit values must be greater than zero");
  }

  const redis = getRedis();

  if (!redis) {
    return consumeMemoryRateLimit(key, limit, windowSeconds);
  }

  const script = `
    local current = redis.call("INCR", KEYS[1])

    if current == 1 then
      redis.call("EXPIRE", KEYS[1], ARGV[1])
    end

    local ttl = redis.call("TTL", KEYS[1])

    if ttl < 0 then
      redis.call("EXPIRE", KEYS[1], ARGV[1])
      ttl = tonumber(ARGV[1])
    end

    return { current, ttl }
  `;

  try {
    const result = (await redis.eval(
      script,
      1,
      key,
      windowSeconds.toString()
    )) as [number, number];

    const current = Number(result[0]);
    const ttl = Math.max(Number(result[1]), 1);

    return {
      allowed: current <= limit,
      limit,
      remaining: Math.max(limit - current, 0),
      retryAfterSeconds: ttl,
    };
  } catch (error) {
    console.error("Redis rate limiter failed; using memory fallback.", error);

    return consumeMemoryRateLimit(key, limit, windowSeconds);
  }
}
