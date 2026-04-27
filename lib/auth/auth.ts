import { betterAuth } from "better-auth";
import { organization } from "better-auth/plugins";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { globalDb } from "@/db/global/client";
import * as schema from "@/db/global/schema";
import { onUserCreated } from "@/lib/org/signup";

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET!,
  baseURL: process.env.BETTER_AUTH_URL!,
  database: drizzleAdapter(globalDb, {
    provider: "sqlite",
    schema,
  }),
  emailAndPassword: {
    enabled: true,
  },
  plugins: [
    organization({
      allowUserToCreateOrganization: true,
      creatorRole: "owner",
    }),
  ],
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          await onUserCreated(user.id, user.name);
        },
      },
    },
  },
});