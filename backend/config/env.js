import { config } from "dotenv";

config({
  path: "./.env.development.local",
});

export const { DATABASE_URL, PORT, JWT_SECRET, NODE_ENV } = process.env;
