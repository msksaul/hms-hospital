import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { globalDb } from "@/db/global/client";
import { organization, member } from "@/db/global/schema";
import { createPendingMapping, provisionOrg } from "@/lib/org/provision";
import { nanoid } from "nanoid";

export async function POST(req: NextRequest) {
  // 1. Authenticate
  const session = await auth.api.getSession({
    headers: req.headers,
  });

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 2. Parse body
  const body = await req.json();
  const { name, slug } = body;

  if (!name || !slug) {
    return NextResponse.json(
      { error: "Name and slug are required" },
      { status: 400 }
    );
  }

  // 3. Check slug uniqueness
  const existing = await globalDb.query.organization.findFirst({
    where: (org, { eq }) => eq(org.slug, slug),
  });

  if (existing) {
    return NextResponse.json(
      { error: "Slug already taken" },
      { status: 409 }
    );
  }

  // 4. Create organization
  const orgId = nanoid();
  const now = new Date();

  await globalDb.insert(organization).values({
    id: orgId,
    name,
    slug,
    createdAt: now,
  });

  // 5. Add user as owner
  await globalDb.insert(member).values({
    id: nanoid(),
    organizationId: orgId,
    userId: session.user.id,
    role: "owner",
    createdAt: now,
  });

  // 6. Create pending mapping
  await createPendingMapping(orgId);

  // 7. Provision the DB inline (blocks for ~5-10s, client shows feedback)
  const provision = await provisionOrg(orgId);

  return NextResponse.json(
    {
      organization: {
        id: orgId,
        name,
        slug,
      },
      provision: {
        success: provision.success,
        status: provision.status,
        attempts: provision.attempts,
        error: provision.error,
      },
    },
    { status: 201 }
  );
}