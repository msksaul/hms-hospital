import { globalDb } from "@/db/global/client";
import { organizations, memberships } from "@/db/global/schema";
import { provisionOrg, createPendingMapping } from "./provision";
import { nanoid } from "nanoid";
import type { ProvisionResult } from "@/types";

/**
 * Called from Better Auth's onUserCreated hook.
 * Creates a personal org + membership + attempts DB provisioning.
 *
 * This blocks the signup response for a few seconds,
 * but the client shows "Creating your workspace..." during that time.
 */
export async function onUserCreated(
  userId: string,
  userName: string
): Promise<{ orgId: string; provision: ProvisionResult }> {
  const slug = `org-${userId.slice(0, 8)}-${nanoid(6)}`;
  const orgName = `${userName}'s Organization`;
  const now = new Date();
  const ownerId = userId

  // 1. Create the organization
  const [newOrg] = await globalDb
    .insert(organizations)
    .values({
      id: nanoid(),
      name: orgName,
      slug,
      ownerId,
      createdAt: now,
      updatedAt: now
    })
    .returning();

  if (!newOrg) {
    throw new Error("Failed to create organization");
  }

  // 2. Add user as owner
  await globalDb.insert(memberships).values({
    id: nanoid(),
    organizationId: newOrg.id,
    userId,
    role: "owner",
    createdAt: now,
  });

  // 3. Create a pending mapping row
  await createPendingMapping(newOrg.id);

  // 4. Attempt to provision (up to 3 retries, ~5-10s)
  const provision = await provisionOrg(newOrg.id);

  return { orgId: newOrg.id, provision };
}