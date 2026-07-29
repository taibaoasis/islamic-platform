import type { Role } from "@prisma/client";

import {
  ROLE_PERMISSIONS,
  type Permission,
} from "./permissions";

export class AuthorizationError extends Error {
  constructor(message = "You are not authorized to perform this action.") {
    super(message);
    this.name = "AuthorizationError";
  }
}

export function hasRole(
  userRole: Role | null | undefined,
  allowedRoles: readonly Role[],
): boolean {
  if (!userRole) {
    return false;
  }

  return allowedRoles.includes(userRole);
}

export function hasPermission(
  userRole: Role | null | undefined,
  permission: Permission,
): boolean {
  if (!userRole) {
    return false;
  }

  return ROLE_PERMISSIONS[userRole].includes(permission);
}

export function requireRole(
  userRole: Role | null | undefined,
  allowedRoles: readonly Role[],
): asserts userRole is Role {
  if (!hasRole(userRole, allowedRoles)) {
    throw new AuthorizationError(
      "Your role does not allow this action.",
    );
  }
}

export function requirePermission(
  userRole: Role | null | undefined,
  permission: Permission,
): asserts userRole is Role {
  if (!hasPermission(userRole, permission)) {
    throw new AuthorizationError(
      "You do not have the required permission.",
    );
  }
}