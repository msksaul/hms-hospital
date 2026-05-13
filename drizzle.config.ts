import { defineConfig } from "drizzle-kit";
import "dotenv/config";

const dbUrl = process.env.TURSO_GLOBAL_DB_URL;
const dbAuthToken = process.env.TURSO_GLOBAL_DB_AUTH_TOKEN;

if (!dbUrl) {
  throw new Error("Missing TURSO_GLOBAL_DB_URL in environment.");
}

export default defineConfig({
  dialect: "turso",
  schema: "./db/global/schema.ts",
  out: "./db/migrations/global",
  dbCredentials: {
    url: dbUrl,
    authToken: dbAuthToken,
  },
});