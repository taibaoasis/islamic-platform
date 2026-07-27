import { NextResponse } from "next/server";

import { db } from "@/lib/db";

/**
 * فحص جاهزية أساسي — يتحقق من الاتصال بقاعدة البيانات.
 * يُستخدم من قِبل أدوات المراقبة (uptime checks, load balancer health checks).
 *
 * Basic readiness check — verifies DB connectivity.
 * Used by monitoring tools (uptime checks, load balancer health checks).
 */
export async function GET() {
  try {
    await db.$queryRaw`SELECT 1`;
    return NextResponse.json({ status: "ok", db: "connected" });
  } catch {
    return NextResponse.json({ status: "error", db: "disconnected" }, { status: 503 });
  }
}
