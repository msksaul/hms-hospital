import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { cache } from "react";
import { globalDb } from "@/db/global/client";
import { orgDbMapping } from "@/db/global/schema";
import { eq } from "drizzle-orm";
import * as orgSchema from "@/db/org/schema";
import type { OrgStatus } from "@/types";

// ──────────────────────────────────────────────
// Strong cache: in-process connection pool
// Persists across requests in the same process
// ──────────────────────────────────────────────

const MAX_POOL_SIZE = 100;

const dbPool = new Map<
  string,
  ReturnType<typeof drizzle<typeof orgSchema>>
>();

function addToPool(
  orgId: string,
  db: ReturnType<typeof drizzle<typeof orgSchema>>
) {
  if (dbPool.size >= MAX_POOL_SIZE) {
    const firstKey = dbPool.keys().next().value;
    if (firstKey) dbPool.delete(firstKey);
  }
  dbPool.set(orgId, db);
}

// ──────────────────────────────────────────────
// Request cache: deduplicate mapping lookups
// ──────────────────────────────────────────────

const getOrgDbMapping = cache(async (orgId: string) => {
  return globalDb.query.orgDbMapping.findFirst({
    where: eq(orgDbMapping.orgId, orgId),
  });
});

// ──────────────────────────────────────────────
// Get the org's database status (short cache)
// ──────────────────────────────────────────────

export async function getOrgStatus(orgId: string): Promise<OrgStatus | null> {
  const mapping = await getOrgDbMapping(orgId);
  return (mapping?.status as OrgStatus) ?? null;
}

// ──────────────────────────────────────────────
// Get a Drizzle instance for the org's database
// ──────────────────────────────────────────────

export async function getOrgDb(orgId: string) {
  // 1. Check strong cache
  const cached = dbPool.get(orgId);
  if (cached) return cached;

  // 2. Look up mapping (request-cached)
  const mapping = await getOrgDbMapping(orgId);

  if (!mapping) {
    throw new Error(`No DB mapping found for org ${orgId}`);
  }

  if (mapping.status !== "ready") {
    throw new Error(
      `Org ${orgId} database is not ready (status: ${mapping.status})`
    );
  }

  // 3. Create new connection
  const client = createClient({
    url: mapping.dbUrl,
    authToken: mapping.dbAuthToken,
  });

  const orgDb = drizzle(client, { schema: orgSchema });

  // 4. Store in strong cache
  addToPool(orgId, orgDb);

  return orgDb;
}