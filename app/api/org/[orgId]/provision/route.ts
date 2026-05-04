import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { ensureOrgProvisioned } from "@/lib/org/provision";
import { globalDb } from "@/db/global/client";
import { memberships } from "@/db/global/schema";
import { eq, and } from "drizzle-orm";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ orgId: string }> }
) {
  const { orgId } = await params;

  // 1. Authenticate
  const session = await auth.api.getSession({
    headers: req.headers,
  });

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 2. Verify membership
  const membership = await globalDb.query.memberships.findFirst({
    where: and(
      eq(memberships.userId, session.user.id),
      eq(memberships.organizationId, orgId)
    ),
  });

  if (!membership) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // 3. Attempt to provision
  const result = await ensureOrgProvisioned(orgId);

  return NextResponse.json({
    success: result.success,
    status: result.status,
    attempts: result.attempts,
    error: result.error,
  });
}