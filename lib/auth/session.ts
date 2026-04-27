import { cache } from "react";
import { auth } from "./auth";
import { headers } from "next/headers";

export async function getSession() {
  const h = await headers();
  const session = await auth.api.getSession({
    headers: h,
  });
  return session;
}
/**
 * Layer 1: Identity — request-cached session getter.
 * Returns { session, user } or null.
 * Only one DB call per request, no matter how many times this is called.
 */
export const getSessionCached = cache(async () => {
  return getSession();
});