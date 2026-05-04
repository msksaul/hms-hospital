"use server";

import { headers } from "next/headers";
import { globalDb } from "@/db/global/client";
import { memberships } from "@/db/global/schema";
import { eq } from "drizzle-orm";

/**
 * After OAuth callback, find the user's org to redirect them.
 */
export async function getUserOrgPath(): Promise<string | null> {
  const { auth } = await import("@/lib/auth/auth");
  const h = await headers();
  const session = await auth.api.getSession({ headers: h });

  if (!session) return null;

  const membership = await globalDb.query.memberships.findFirst({
    where: eq(memberships.userId, session.user.id),
  });

  if (!membership) return null;

  return `/org/${membership.organizationId}`;
}