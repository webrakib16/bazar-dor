import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";

const mongoUrl = process.env.BETTER_AUTH_DB_URL;

if (!mongoUrl) {
  throw new Error("BETTER_AUTH_DB_URL is not defined");
}

const client = new MongoClient(mongoUrl);
const db = client.db();

export const auth = betterAuth({

     emailAndPassword: { 
    enabled: true, 
  }, 
  
  database: mongodbAdapter(db, {
    client,
  }),
});