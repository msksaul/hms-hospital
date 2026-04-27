import { getOrgDb } from '@/lib/db/get-org-db';

export type Role = "owner" | "admin" | "member" | "viewer";

export type Permission = string;

export type OrgStatus = "pending" | "provisioning" | "ready" | "error";

export interface AccessContext {
  membership: {
    id: string;
    userId: string;
    organizationId: string;
    role: Role;
    createdAt: Date;
  };
  role: Role;
  permissions: Permission[];
}

export interface OrgDbMapping {
  id: string;
  orgId: string;
  dbUrl: string;
  dbAuthToken: string;
  status: OrgStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProvisionResult {
  success: boolean;
  status: OrgStatus;
  attempts: number;
  error: string | null;
}

export type OrgDb = Awaited<ReturnType<typeof getOrgDb>>