import { defineConfig } from "@playwright/test";

const WEB_URL = "http://localhost:3000";
const API_HEALTH_URL = "http://localhost:4000/healthz";
const SERVER_START_TIMEOUT_MS = 120_000;

export default defineConfig({
  testDir: "e2e",
  use: { baseURL: WEB_URL },
  webServer: [
    {
      command: "pnpm --filter @miseboard/api dev",
      url: API_HEALTH_URL,
      timeout: SERVER_START_TIMEOUT_MS,
      reuseExistingServer: !process.env.CI,
    },
    {
      command: "pnpm --filter @miseboard/web dev",
      url: WEB_URL,
      timeout: SERVER_START_TIMEOUT_MS,
      reuseExistingServer: !process.env.CI,
    },
  ],
});
