import type { Role } from "@prisma/client";

export const ROLES = {
  VISITOR: "VISITOR",
  MEMBER: "MEMBER",
  STUDENT: "STUDENT",
  TEACHER: "TEACHER",
  SCHOLAR_REVIEWER: "SCHOLAR_REVIEWER",
  COMMUNITY_MODERATOR: "COMMUNITY_MODERATOR",
  ADMIN: "ADMIN",
} as const satisfies Record<Role, Role>;

export const ALL_ROLES: readonly Role[] = Object.values(ROLES);