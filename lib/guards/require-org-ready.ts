import { ensureOrgProvisioned } from "@/lib/org/provision";
import type { ProvisionResult } from "@/types";

/**
 * Require that the org's database is provisioned and ready.
 *
 * If the org is not ready, this will attempt to provision it
 * inline (up to 3 retries). The calling request will block
 * for a few seconds, but the UI shows feedback.
 *
 * Returns the ProvisionResult so callers can inspect it.
 * Throws an error only if provisioning fails after all retries.
 */
export async function requireOrgReady(
  orgId: string
): Promise<ProvisionResult> {
  const result = await ensureOrgProvisioned(orgId);

  if (!result.success) {
    throw new Error(
      `Organization database provisioning failed: ${result.error}. Please try again later.`
    );
  }

  return result;
}