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
    usePlural: true
  }),
  emailAndPassword : {
    enabled: false
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!
    }
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
  session: {
    expiresIn: 60 * 60 * 24 * 30
  }
});