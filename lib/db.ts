import { PrismaClient } from "@prisma/client";

/**
 * نمط الـ Singleton القياسي لـ Prisma في Next.js — يمنع فتح اتصالات جديدة
 * بقاعدة البيانات مع كل Hot Reload أثناء التطوير.
 *
 * Standard Prisma singleton pattern for Next.js — prevents opening new
 * DB connections on every hot reload during development.
 */

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
