import { requireMembership } from "@/lib/guards/require-membership";
import { requireOrgReady } from "@/lib/guards/require-org-ready";
import { AppSidebar } from '@/shared/components/app-sidebar';
import { SiteHeader } from '@/shared/components/site-header';
import { SidebarInset, SidebarProvider } from '@/shared/components/ui/sidebar';

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
  const { access, user } = await requireMembership(orgId);

  // Layer 3: Org Ready (provisions inline if needed)
  // This blocks for a few seconds on first access
  // while the DB is being created
  await requireOrgReady(orgId);
  // ─────────────────────────────────────────────

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar user={user} variant='inset'/>
      <SidebarInset>
        <SiteHeader orgName={access.membership.organizationName}/>
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2 p-6">  
            {children}      
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}