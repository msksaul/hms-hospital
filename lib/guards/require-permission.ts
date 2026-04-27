import { notFound } from "next/navigation";
import type { AccessContext, Permission } from "@/types";

/**
 * Require that the user has a specific permission.
 * Must be called after requireMembership() so we have the AccessContext.
 * Returns 404 if lacking permission (no info leakage).
 */
export function requirePermission(
  access: AccessContext,
  permission: Permission
): void {
  if (!access.permissions.includes(permission)) {
    notFound();
  }
}