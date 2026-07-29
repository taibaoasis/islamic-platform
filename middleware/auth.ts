import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const ADMIN_PAGE_PATTERN = /^\/[^/]+\/admin(?:\/.*)?$/;
const DASHBOARD_PAGE_PATTERN = /^\/[^/]+\/dashboard(?:\/.*)?$/;
const ADMIN_API_PATTERN = /^\/api\/admin(?:\/.*)?$/;

function isAdminPage(pathname: string): boolean {
  return ADMIN_PAGE_PATTERN.test(pathname);
}

function isDashboardPage(pathname: string): boolean {
  return DASHBOARD_PAGE_PATTERN.test(pathname);
}

function isAdminApi(pathname: string): boolean {
  return ADMIN_API_PATTERN.test(pathname);
}

function unauthorizedApiResponse(): NextResponse {
  return NextResponse.json(
    {
      error: "UNAUTHORIZED",
      message: "Authentication is required.",
    },
    { status: 401 },
  );
}

function forbiddenApiResponse(): NextResponse {
  return NextResponse.json(
    {
      error: "FORBIDDEN",
      message: "You do not have permission to access this resource.",
    },
    { status: 403 },
  );
}

function redirectToSignIn(request: NextRequest): NextResponse {
  const signInUrl = new URL("/api/auth/signin", request.url);

  signInUrl.searchParams.set(
    "callbackUrl",
    `${request.nextUrl.pathname}${request.nextUrl.search}`,
  );

  return NextResponse.redirect(signInUrl);
}

/**
 * Protects authenticated and administrator-only routes.
 *
 * Protected routes:
 * - /[locale]/dashboard/**
 * - /[locale]/admin/**
 * - /api/admin/**
 */
export async function authMiddleware(
  request: NextRequest,
): Promise<NextResponse | null> {
  const pathname = request.nextUrl.pathname;

  const requiresAuthentication =
    isDashboardPage(pathname) ||
    isAdminPage(pathname) ||
    isAdminApi(pathname);

  if (!requiresAuthentication) {
    return null;
  }

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!token) {
    return isAdminApi(pathname)
      ? unauthorizedApiResponse()
      : redirectToSignIn(request);
  }

  const requiresAdmin = isAdminPage(pathname) || isAdminApi(pathname);

  if (requiresAdmin && token.role !== "ADMIN") {
    if (isAdminApi(pathname)) {
      return forbiddenApiResponse();
    }

    return new NextResponse("Forbidden", {
      status: 403,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    });
  }

  return null;
}
