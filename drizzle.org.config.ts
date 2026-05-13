import { defineConfig } from "drizzle-kit";
import "dotenv/config";

const dbUrl = process.env.TURSO_TEMPLATE_DATABASE_URL!
const dbAuthToken = process.env.TURSO_TEMPLATE_DATABASE_AUTH_TOKEN!

if (!dbUrl) {
  throw new Error(
    "Missing TURSO_TEMPLATE_DATABASE_URL (or TURSO_GLOBAL_DB_URL fallback) in environment."
  );
}

if (!dbAuthToken) {
  throw new Error(
    "Missing TURSO_TEMPLATE_DATABASE_AUTH_TOKEN (or TURSO_GLOBAL_DB_AUTH_TOKEN fallback) in environment."
  );
}

export default defineConfig({
  dialect: "turso",
  schema: "./db/org/schema.ts",
  out: "./db/migrations/org",
  dbCredentials: {
    url: dbUrl,
    authToken: dbAuthToken,
  },
});