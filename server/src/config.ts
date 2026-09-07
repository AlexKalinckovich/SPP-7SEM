import * as dotenv from "dotenv";
import * as fs from "fs";
import * as path from "path";

const cwd = process.cwd();

const possibleEnvPaths = [
  path.resolve(cwd, ".env"),
  path.resolve(cwd, "server/.env"),
  path.resolve(__dirname, "../../.env"),
  path.resolve(__dirname, "../../server/.env"),
];

for (const envPath of possibleEnvPaths) {
  if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
    break;
  }
}

const confName = process.env.NODE_ENV === "production" ? "prod.conf" : "local.conf";
const possibleConfPaths = [
  path.resolve(cwd, confName),
  path.resolve(cwd, "server", confName),
  path.resolve(__dirname, "../../server", confName),
];

for (const confPath of possibleConfPaths) {
  if (fs.existsSync(confPath)) {
    dotenv.config({ path: confPath });
    break;
  }
}

export const config = {
  env: process.env.NODE_ENV ?? "development",
  port: Number(process.env.SERVER_PORT ?? 3000),
  baseUrl: process.env.SERVER_BASE_URL ?? "http://localhost:3000",
  clientApiBaseUrl: process.env.CLIENT_API_BASE_URL ?? "http://localhost:3000/api",
};