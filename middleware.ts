import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { authMiddleware } from "@/middleware/auth";

export async function middleware(
  request: NextRequest,
): Promise<NextResponse> {
  const authResponse = await authMiddleware(request);

  if (authResponse) {
    return authResponse;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Run middleware on application routes while excluding Next.js assets
     * and common public files.
     */
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)",
  ],
};
