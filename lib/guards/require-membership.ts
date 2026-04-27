import { redirect } from "next/navigation";
import { getSessionCached } from "@/lib/auth/session";
import { getAccessContext } from "@/lib/rbac/get-permissions";
import type { AccessContext } from "@/types";

/**
 * Require that the current user is a member of the given org.
 * Returns AccessContext if they are.
 */
export async function requireMembership(
  orgId: string
): Promise<AccessContext> {
  const session = await getSessionCached();

  if (!session) {
    redirect("/login");
  }

  const access = await getAccessContext(session.user.id, orgId);

  if (!access) {
    redirect("/");
  }

  return access;
}