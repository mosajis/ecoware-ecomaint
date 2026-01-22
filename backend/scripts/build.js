import { $ } from "bun";
import { rm, mkdir, cp } from "fs/promises";
import path from "path";

const log = {
  success: (msg) => console.log(`[build-backend] ✅ ${msg}`),
  error: (msg) => console.error(`[build-backend] ❌ ${msg}`),
};

const outDir = path.resolve(process.cwd(), "../build");

try {
  // پاک کردن build قبلی
  await rm(outDir, { recursive: true, force: true });
  await mkdir(outDir, { recursive: true });
  log.success("Old build cleared.");

  // اجرای Prisma generate
  try {
    await $`bun run prisma generate`;
    log.success("Prisma generate completed.");
  } catch (e) {
    log.error("Prisma generate failed.");
    throw e;
  }

  // Build و bundle با Bun
  try {
    await $`bun build src/main.ts --outdir ${outDir} --target bun --release`;
    log.success("TypeScript build & bundle completed.");
  } catch (e) {
    log.error("TypeScript build failed.");
    throw e;
  }

  // کپی ORM
  try {
    await cp("./orm", `${outDir}/orm`, { recursive: true });
    log.success("ORM folder copied.");
  } catch (e) {
    log.error("Failed to copy ORM folder.");
    throw e;
  }

  // کپی .env
  try {
    await cp(".env", `${outDir}/.env`);
    log.success(".env copied.");
  } catch {
    log.error(".env not found, skipped.");
  }
} catch (e) {
  log.error("BUILD FAILED");
  process.exit(1);
}
