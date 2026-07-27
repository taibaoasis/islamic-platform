import type { NextRequest } from "next/server";

import { intlMiddleware } from "@/middleware/i18n";
import { authMiddleware } from "@/middleware/auth";

/**
 * نقطة الدخول الوحيدة لـ Proxy في Next.js 16 (الاسم الجديد لِـ middleware —
 * نفس الآلية والـ API، تم فقط تغيير اسم الملف الجذري من middleware.ts إلى
 * proxy.ts). تُركّب هذه النقطة وحدات مجلد middleware/ بدل تكديس كل
 * المنطق هنا مباشرة.
 *
 * Single entry point for Proxy in Next.js 16 (the renamed replacement
 * for middleware — same mechanism and API, only the root file name
 * changed from middleware.ts to proxy.ts). This composes the modules
 * from the middleware/ folder instead of stacking all logic here.
 */
export default function proxy(request: NextRequest) {
  const authResponse = authMiddleware(request);
  if (authResponse) return authResponse;

  return intlMiddleware(request);
}

export const config = {
  // يستثني ملفات الـ API والملفات الثابتة من معالجة i18n/auth
  // Excludes API routes and static files from i18n/auth handling
  matcher: ["/((?!api|trpc|_next|_vercel|.*\\..*).*)"],
};
