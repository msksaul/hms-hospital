import { globalDb } from "@/db/global/client";
import { orgDbMapping } from "@/db/global/schema";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import type { OrgStatus, ProvisionResult } from "@/types";

const TURSO_API_BASE = "https://api.turso.tech/v1";
const TURSO_API_TOKEN = process.env.TURSO_API_TOKEN!;
const TURSO_ORG_SLUG = process.env.TURSO_ORG_SLUG!;
const TURSO_TEMPLATE_DB_NAME = process.env.TURSO_TEMPLATE_DB_NAME!;
const TURSO_DB_GROUP = process.env.TURSO_DB_GROUP

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 2_000;

// ──────────────────────────────────────────────
// Low-level: Clone template DB via Turso API
// ──────────────────────────────────────────────

async function cloneTemplateDatabase(orgId: string): Promise<{
  dbUrl: string;
  dbAuthToken: string;
}> {
  const dbName = `org-${orgId.slice(0, 12).toLowerCase()}-user`;

  // Step 1: Create DB seeded from template
  const createRes = await fetch(
    `${TURSO_API_BASE}/organizations/${TURSO_ORG_SLUG}/databases`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${TURSO_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: dbName,
        group: TURSO_DB_GROUP,
        seed: {
          type: "database",
          name: TURSO_TEMPLATE_DB_NAME,
        },
      }),
    }
  );

  if (!createRes.ok) {
    const err = await createRes.text();
    throw new Error(`Failed to create Turso DB: ${err}`);
  }

  const createData = await createRes.json();
  const hostname =
    createData.database?.Hostname ??
    `${dbName}-${TURSO_ORG_SLUG}.turso.io`;
  const dbUrl = `libsql://${hostname}`;

  // Step 2: Create auth token for the new DB
  const tokenRes = await fetch(
    `${TURSO_API_BASE}/organizations/${TURSO_ORG_SLUG}/databases/${dbName}/auth/tokens`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${TURSO_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ expiration: "never" }),
    }
  );

  if (!tokenRes.ok) {
    const err = await tokenRes.text();
    throw new Error(`Failed to create DB auth token: ${err}`);
  }

  const tokenData = await tokenRes.json();
  const dbAuthToken = tokenData.token;

  return { dbUrl, dbAuthToken };
}

// ──────────────────────────────────────────────
// Update mapping status
// ──────────────────────────────────────────────

async function updateMappingStatus(
  orgId: string,
  status: OrgStatus,
  updates?: Partial<{ dbUrl: string; dbAuthToken: string; error: string }>
) {
  await globalDb
    .update(orgDbMapping)
    .set({
      status,
      ...updates,
      updatedAt: new Date(),
    })
    .where(eq(orgDbMapping.orgId, orgId));
}

// ──────────────────────────────────────────────
// Create a pending mapping row
// ──────────────────────────────────────────────

export async function createPendingMapping(orgId: string) {
  const now = new Date();
  await globalDb
    .insert(orgDbMapping)
    .values({
      id: nanoid(),
      orgId,
      dbUrl: "",
      dbAuthToken: "",
      status: "pending",
      createdAt: now,
      updatedAt: now,
    })
    .onConflictDoNothing({ target: orgDbMapping.orgId });
}

// ──────────────────────────────────────────────
// Get the current status of an org's DB
// ──────────────────────────────────────────────

export async function getOrgDbMappingStatus(
  orgId: string
): Promise<OrgStatus | null> {
  const mapping = await globalDb.query.orgDbMapping.findFirst({
    where: eq(orgDbMapping.orgId, orgId),
  });
  return (mapping?.status as OrgStatus) ?? null;
}

// ──────────────────────────────────────────────
// Core: provisionOrg with retries
// ──────────────────────────────────────────────

export async function provisionOrg(
  orgId: string
): Promise<ProvisionResult> {
  let lastError: string | null = null;

  // Mark as provisioning
  await updateMappingStatus(orgId, "provisioning");

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      console.log(
        `[provision] Org ${orgId} — attempt ${attempt}/${MAX_RETRIES}`
      );

      // Clone the template DB
      const { dbUrl, dbAuthToken } = await cloneTemplateDatabase(orgId);

      // Store the connection details and mark as ready
      await globalDb
        .update(orgDbMapping)
        .set({
          dbUrl,
          dbAuthToken,
          status: "ready",
          updatedAt: new Date(),
        })
        .where(eq(orgDbMapping.orgId, orgId));

      console.log(`[provision] Org ${orgId} — ready!`);

      return {
        success: true,
        status: "ready",
        attempts: attempt,
        error: null,
      };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      lastError = err.message;
      console.error(
        `[provision] Org ${orgId} — attempt ${attempt} failed: ${lastError}`
      );

      // Wait before retrying (skip on last attempt)
      if (attempt < MAX_RETRIES) {
        await new Promise((r) => setTimeout(r, RETRY_DELAY_MS));
      }
    }
  }

  // All retries exhausted
  await updateMappingStatus(orgId, "error");

  console.error(
    `[provision] Org ${orgId} — all ${MAX_RETRIES} attempts failed`
  );

  return {
    success: false,
    status: "error",
    attempts: MAX_RETRIES,
    error: lastError,
  };
}

// ──────────────────────────────────────────────
// Ensure org is provisioned
// Checks status and provisions if needed.
// This is the main entry point used by guards.
// ──────────────────────────────────────────────

export async function ensureOrgProvisioned(
  orgId: string
): Promise<ProvisionResult> {
  const status = await getOrgDbMappingStatus(orgId);

  // Already ready — nothing to do
  if (status === "ready") {
    return { success: true, status: "ready", attempts: 0, error: null };
  }

  // No mapping at all — create one, then provision
  if (!status) {
    await createPendingMapping(orgId);
  }

  // Provision (pending, provisioning, or error — try again)
  return provisionOrg(orgId);
}