import { exec } from "child_process";
import { rm, mkdir, cp } from "fs/promises";
import path from "path";

const log = {
  success: (msg) => console.log(`[build-backend] ✅ ${msg}`),
  error: (msg) => console.error(`[build-backend] ❌ ${msg}`),
};

const outDir = path.resolve(process.cwd(), "../build");

const run = (cmd) =>
  new Promise((resolve, reject) => {
    exec(cmd, (err, stdout, stderr) => {
      if (err) return reject(stderr || err);
      console.log(stdout);
      resolve(stdout);
    });
  });

try {
  await rm(outDir, { recursive: true, force: true });
  await mkdir(outDir, { recursive: true });
  log.success("Old build cleared.");

  // Prisma generate
  try {
    await run("bun run prisma generate");
    log.success("Prisma generate completed.");
  } catch (e) {
    log.error("Prisma generate failed.");
    throw e;
  }

  // Build bundle
  try {
    await run(`bun build src/main.ts --outdir=${outDir} --target=node`);
    log.success("TypeScript build & bundle completed.");
  } catch (e) {
    log.error("TypeScript build failed.");
    throw e;
  }

  // Copy Prisma binaries (important)
  try {
    // await cp("./node_modules/.prisma", `${outDir}/node_modules/.prisma`, {
    //   recursive: true,
    // });
    // log.success("Prisma binaries copied.");
  } catch (e) {
    // log.error("Failed to copy Prisma binaries.");
    // throw e;
  }

  // Copy ORM
  try {
    await cp("./orm", `${outDir}/orm`, { recursive: true });
    log.success("ORM folder copied.");
  } catch (e) {
    log.error("Failed to copy ORM folder.");
    throw e;
  }

  // Copy public
  try {
    await cp("./public", `${outDir}/public`, { recursive: true });
    log.success("Public folder copied.");
  } catch (e) {
    log.error("Failed to copy public folder.");
    throw e;
  }

  // Copy .env
  try {
    await cp(".env", `${outDir}/.env`);
    log.success(".env copied.");
  } catch {
    log.error(".env not found, skipped.");
  }

  log.success("BUILD COMPLETED SUCCESSFULLY! 🎉");
} catch (e) {
  log.error("BUILD FAILED");
  console.error(e);
  process.exit(1);
}
