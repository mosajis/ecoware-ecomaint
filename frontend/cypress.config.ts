import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:5173",
  },
  env: {
    ADMIN_USERNAME: "sysop",
    ADMIN_PASSWORD: "sysop",
  },
});
