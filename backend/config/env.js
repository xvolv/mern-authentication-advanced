import { config } from "dotenv";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url)); // Get current directory

let envPath = resolve(__dirname, "../.env.development.local");
envPath = "./.env.development.local";

config({ path: envPath });

export const { DATABASE_URL, PORT, JWT_SECRET, NODE_ENV, TOKEN } = process.env;
