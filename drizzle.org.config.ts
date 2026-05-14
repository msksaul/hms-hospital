import { defineConfig } from "drizzle-kit";
import "dotenv/config";

const dbUrl = process.env.TURSO_TEMPLATE_DATABASE_URL!
const dbAuthToken = process.env.TURSO_TEMPLATE_DATABASE_AUTH_TOKEN!

if (!dbUrl) {
  throw new Error(
    "Missing TURSO_TEMPLATE_DATABASE_URL in environment."
  );
}

if (!dbAuthToken) {
  throw new Error(
    "Missing TURSO_TEMPLATE_DATABASE_AUTH_TOKEN in environment."
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