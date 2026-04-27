import type { Role, Permission } from "@/types";

// ──────────────────────────────────────────────
// Permission Constants
// ──────────────────────────────────────────────

export const PERMISSIONS = {
  patients: {
    read: "patients:read",
    write: "patients:write",
    delete: "patients:delete",
  },
  settings: {
    read: "settings:read",
    write: "settings:write",
  },
  members: {
    read: "members:read",
    invite: "members:invite",
    remove: "members:remove",
    changeRole: "members:change_role",
  },
  billing: {
    read: "billing:read",
    manage: "billing:manage",
  },
} as const;

const ALL_PERMISSIONS: Permission[] = Object.values(PERMISSIONS).flatMap(
  (group) => Object.values(group)
);

// ──────────────────────────────────────────────
// Role → Permission Mapping
// ──────────────────────────────────────────────

export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  owner: ALL_PERMISSIONS,

  admin: [
    PERMISSIONS.patients.read,
    PERMISSIONS.patients.write,
    PERMISSIONS.patients.delete,
    PERMISSIONS.settings.read,
    PERMISSIONS.settings.write,
    PERMISSIONS.members.read,
    PERMISSIONS.members.invite,
    PERMISSIONS.members.remove,
    PERMISSIONS.members.changeRole,
    PERMISSIONS.billing.read,
    PERMISSIONS.billing.manage,
  ],

  member: [
    PERMISSIONS.patients.read,
    PERMISSIONS.patients.write,
    PERMISSIONS.settings.read,
    PERMISSIONS.members.read,
    PERMISSIONS.billing.read,
  ],

  viewer: [
    PERMISSIONS.patients.read,
    PERMISSIONS.settings.read,
    PERMISSIONS.members.read,
  ],
};

// ──────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────

export function roleHasPermission(
  role: Role,
  permission: Permission
): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}

export function getPermissionsForRole(role: Role): Permission[] {
  return ROLE_PERMISSIONS[role] ?? [];
}