import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";

const globalDbUrl = process.env.TURSO_GLOBAL_DB_URL!;
const globalDbAuthToken = process.env.TURSO_GLOBAL_DB_AUTH_TOKEN!;

const client = createClient({
  url: globalDbUrl,
  authToken: globalDbAuthToken,
});

export const globalDb = drizzle(client, { schema });