import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";

const mongoUrl = process.env.BETTER_AUTH_DB_URL;
const authSecret = process.env.BETTER_AUTH_SECRET;

const googleClientId = process.env.BETTER_AUTH_GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.BETTER_AUTH_GOOGLE_SECRET;

const githubClientId = process.env.BETTER_AUTH_GITHUB_CLIENT_ID;
const githubClientSecret = process.env.BETTER_AUTH_GITHUB_SECRET;

if (!mongoUrl) {
  throw new Error("BETTER_AUTH_DB_URL is not defined");
}

if (!authSecret) {
  throw new Error("BETTER_AUTH_SECRET is not defined");
}

if (!googleClientId || !googleClientSecret) {
  throw new Error("Google OAuth credentials are not defined");
}

if (!githubClientId || !githubClientSecret) {
  throw new Error("GitHub OAuth credentials are not defined");
}

const client = new MongoClient(mongoUrl);
const db = client.db();

export const auth = betterAuth({
    account: {
    accountLinking: {
    enabled: true,
    trustedProviders: ["google", "github"],
  },
},
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  secret: authSecret,

  database: mongodbAdapter(db, {
    client,
  }),

  emailAndPassword: {
    enabled: true,
  },

  socialProviders: {
    google: {
      clientId: googleClientId,
      clientSecret: googleClientSecret,
    },

    github: {
      clientId: githubClientId,
      clientSecret: githubClientSecret,
    },
  },
});