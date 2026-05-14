import { requireMembership } from "@/lib/guards/require-membership";
import { requireOrgReady } from "@/lib/guards/require-org-ready";
import { OrgShell } from "./org-shell";

interface OrgLayoutProps {
  children: React.ReactNode;
  params: Promise<{ orgId: string }>;
}

export default async function OrgLayout({
  children,
  params,
}: OrgLayoutProps) {
  const { orgId } = await params;

  // ── Guard Chain ──────────────────────────────
  // Layer 1 + 2: Identity + Access Context
  const access = await requireMembership(orgId);

  // Layer 3: Org Ready (provisions inline if needed)
  // This blocks for a few seconds on first access
  // while the DB is being created
  await requireOrgReady(orgId);
  // ─────────────────────────────────────────────

  return (
    <OrgShell
      orgId={orgId}
      role={access.role}
      permissions={access.permissions}
    >
      {children}
    </OrgShell>
  );
}