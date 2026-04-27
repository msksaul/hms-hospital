import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { globalDb } from "@/db/global/client";
import * as schema from "@/db/global/schema";

export const authAdapter = drizzleAdapter(globalDb, {
  provider: "sqlite",
  schema,
});