import { z } from "zod";

/**
 * مصدر واحد وموثّق للوصول إلى متغيرات البيئة.
 * Single, validated source of truth for environment variables.
 *
 * لا تقرأ process.env مباشرة في أي مكان آخر من الكود — استورد من هنا فقط.
 * Never read process.env directly elsewhere — import from this module only.
 */

const serverEnvSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),

  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),

  AUTH_SECRET: z.string().min(1, "AUTH_SECRET is required"),
  AUTH_URL: z.url().optional(),
  AUTH_GOOGLE_ID: z.string().optional(),
  AUTH_GOOGLE_SECRET: z.string().optional(),

  STORAGE_ENDPOINT: z.string().optional(),
  STORAGE_REGION: z.string().default("us-east-1"),
  STORAGE_BUCKET: z.string().optional(),
  STORAGE_ACCESS_KEY_ID: z.string().optional(),
  STORAGE_SECRET_ACCESS_KEY: z.string().optional(),

  SEARCH_NODE_URL: z.string().optional(),
  SEARCH_USERNAME: z.string().optional(),
  SEARCH_PASSWORD: z.string().optional(),
  SEARCH_INDEX_PREFIX: z.string().default("islamic_platform"),

  REDIS_URL: z.string().optional(),
  REDIS_ENABLED: z
    .string()
    .default("false")
    .transform((v) => v === "true"),
});

const clientEnvSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.url().default("http://localhost:3000"),
  NEXT_PUBLIC_APP_NAME: z.string().default("Islamic Platform"),
  NEXT_PUBLIC_CDN_HOSTNAME: z.string().default("cdn.example.com"),
});

function parseServerEnv() {
  const parsed = serverEnvSchema.safeParse(process.env);
  if (!parsed.success) {
    console.error(
      "❌ متغيرات بيئة غير صالحة / Invalid environment variables:",
      z.flattenError(parsed.error).fieldErrors
    );
    throw new Error("Invalid environment variables");
  }
  return parsed.data;
}

function parseClientEnv() {
  const parsed = clientEnvSchema.safeParse({
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
    NEXT_PUBLIC_CDN_HOSTNAME: process.env.NEXT_PUBLIC_CDN_HOSTNAME,
  });
  if (!parsed.success) {
    throw new Error("Invalid public environment variables");
  }
  return parsed.data;
}

// Server-only values. Importing this in a client component is a build-time error
// by convention — keep server env access inside server components / route handlers.
export const serverEnv = typeof window === "undefined" ? parseServerEnv() : (undefined as never);

// Safe to use anywhere (client or server).
export const clientEnv = parseClientEnv();
