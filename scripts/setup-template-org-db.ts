import { execSync } from "node:child_process";
import "dotenv/config";

const TEMPLATE_DB_NAME = "template-org-db";
const GROUP = process.env.TURSO_DB_GROUP!;

function run(cmd: string, capture = false) {
  console.log(`\n> ${cmd}`);
  return execSync(cmd, { stdio: capture ? "pipe" : "inherit", encoding: 'utf-8' });
}

async function setupTemplateOrgDb() {
  try {
    // 1. Ensure DB exists
    try {
      run(`turso db create ${TEMPLATE_DB_NAME} --group ${GROUP}`);
    } catch {
      console.log("DB already exists, continuing...");
    }

    const token = run(`turso db tokens create ${TEMPLATE_DB_NAME}`, true).trim();
    // 2. Point drizzle to this DB dynamically
    const dbUrl = `libsql://${TEMPLATE_DB_NAME}-${process.env.TURSO_ORG_SLUG}.turso.io`;

    process.env.TURSO_TEMPLATE_DATABASE_URL = dbUrl;
    process.env.TURSO_TEMPLATE_DATABASE_AUTH_TOKEN = token;
    // 3. Generate migrations
    run(`npx drizzle-kit generate --config=drizzle.org.config.ts`);

    // 4. Apply schema
    run(`npx drizzle-kit push --config=drizzle.org.config.ts`);

    console.log("\n✅ Template DB ready");
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

setupTemplateOrgDb();