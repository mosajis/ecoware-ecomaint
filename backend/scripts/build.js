// scripts/build.ts
import { $ } from "bun";
import { rm, mkdir, cp } from "fs/promises";
import path from "path";

// مسیر خروجی build (یک لایه بالاتر)
const outDir = path.resolve(process.cwd(), "../build");

// پاک کردن build قبلی
console.log("🧹 Cleaning build directory...");
await rm(outDir, { recursive: true, force: true });
await mkdir(outDir, { recursive: true });

// اجرای Prisma generate
console.log("🔧 Running prisma generate...");
await $`bun run prisma:generate`;

// Build و bundle با Bun (تمام imports + node_modules bundle میشه)
console.log("🏗️ Building & bundling with Bun...");
await $`bun build src/main.ts --outdir ${outDir} --target bun --release`;

// کپی ORM
console.log("📁 Copying ORM folder...");
await cp("./orm", `${outDir}/orm`, { recursive: true });

// کپی .env (اختیاری)
console.log("📁 Copying .env if exists...");
try {
  await cp(".env", `${outDir}/.env`);
} catch {}

// اجرای generate API اگر تعریف شده باشد
console.log("⚙️ Running generate:api (optional)...");
try {
  await $`bun run generate:api`;
} catch {
  console.log("⏩ generate:api skipped");
}

console.log("🎉 BUILD COMPLETED -> ../build");
