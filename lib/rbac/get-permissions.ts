import { cache } from "react";
import { globalDb } from "@/db/global/client";
import { member } from "@/db/global/schema";
import { eq, and } from "drizzle-orm";
import { getPermissionsForRole } from "./permissions";
import type { Role, Permission, AccessContext } from "@/types";

/**
 * Get the user's membership in an org. Request-cached.
 */
export const getMembership = cache(
  async (userId: string, orgId: string) => {
    const result = await globalDb.query.member.findFirst({
      where: and(
        eq(member.userId, userId),
        eq(member.organizationId, orgId)
      ),
    });
    return result ?? null;
  }
);

/**
 * Get the user's permissions in an org. Request-cached.
 */
export const getPermissions = cache(
  async (userId: string, orgId: string): Promise<Permission[]> => {
    const membership = await getMembership(userId, orgId);
    if (!membership) return [];
    return getPermissionsForRole(membership.role as Role);
  }
);

/**
 * Layer 2: Get the full access context for a user in an org.
 * Primary entry point for access context.
 * Request-cached: membership + permissions in one deduped call.
 */
export const getAccessContext = cache(
  async (userId: string, orgId: string): Promise<AccessContext | null> => {
    const membership = await getMembership(userId, orgId);
    if (!membership) return null;

    const role = membership.role as Role;
    const permissions = getPermissionsForRole(role);

    return {
      membership: {
        id: membership.id,
        userId: membership.userId,
        organizationId: membership.organizationId,
        role,
        createdAt: membership.createdAt,
      },
      role,
      permissions,
    };
  }
);