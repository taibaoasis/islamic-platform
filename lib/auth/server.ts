import "server-only";

import type { Role } from "@prisma/client";
import { getServerSession, type Session } from "next-auth";

import { authOptions } from "@/lib/auth";

import {
  AuthorizationError,
  requirePermission,
  requireRole,
} from "./authorization";
import type { Permission } from "./permissions";

export class AuthenticationError extends Error {
  constructor(message = "Authentication is required.") {
    super(message);
    this.name = "AuthenticationError";
  }
}

export async function getCurrentSession(): Promise<Session | null> {
  return getServerSession(authOptions);
}

export async function getCurrentUser(): Promise<Session["user"] | null> {
  const session = await getCurrentSession();

  return session?.user ?? null;
}

export async function getCurrentUserRole(): Promise<Role | null> {
  const user = await getCurrentUser();

  return user?.role ?? null;
}

export async function requireAuthentication(): Promise<Session["user"]> {
  const user = await getCurrentUser();

  if (!user) {
    throw new AuthenticationError();
  }

  return user;
}

export async function requireCurrentRole(
  allowedRoles: readonly Role[],
): Promise<Session["user"]> {
  const user = await requireAuthentication();

  requireRole(user.role, allowedRoles);

  return user;
}

export async function requireCurrentPermission(
  permission: Permission,
): Promise<Session["user"]> {
  const user = await requireAuthentication();

  requirePermission(user.role, permission);

  return user;
}

export function isAuthenticationError(
  error: unknown,
): error is AuthenticationError {
  return error instanceof AuthenticationError;
}

export function isAuthorizationError(
  error: unknown,
): error is AuthorizationError {
  return error instanceof AuthorizationError;
}
