import { config } from "dotenv";
const envPath = "./.env.development.local";

config({ path: envPath });

export const { DATABASE_URL, PORT, JWT_SECRET, NODE_ENV, TOKEN, CLIENT_URL } =
  process.env;
