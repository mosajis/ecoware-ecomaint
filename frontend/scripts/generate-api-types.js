import fs from "fs";
import fsp from "fs/promises";
import http from "http";
import https from "https";
import { execSync } from "child_process";

const url = "http://localhost:5273/docs/json";
const outputPath = "./openapi.json";
const typesPath = "./src/core/api/generated/api.types.ts";

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const fileStream = fs.createWriteStream(dest);
    const client = url.startsWith("https") ? https : http;

    client
      .get(url, (response) => {
        if (response.statusCode && response.statusCode >= 400) {
          reject(
            new Error(`Failed to download. Status code: ${response.statusCode}`)
          );
          return;
        }
        response.pipe(fileStream);
        fileStream.on("finish", () => {
          fileStream.close(() => resolve());
        });
      })
      .on("error", (err) => {
        fileStream.close(() => {
          fsp.unlink(dest).catch(() => {});
          reject(err);
        });
      });
  });
}

async function fixTypesFile(path) {
  let content = await fsp.readFile(path, "utf-8");

  // اصلاح string | number به number
  content = content.replace(/\bstring\s*\|\s*number\b/g, "number");

  // حذف همه | unknown ها
  content = content.replace(/\s*\|\s*unknown/g, "");

  content = content.replace(/\s*\|\s*\(?Record<string,\s*never>\)?/g, "");

  // اختیاری: حذف | any هم اگر لازم باشه
  // content = content.replace(/\s*\|\s*any/g, "");

  await fsp.writeFile(path, content, "utf-8");
  console.log("✅ Fixed types and removed | unknown");
}

(async () => {
  try {
    await download(url, outputPath);
    console.log("Downloaded OpenAPI spec.");

    execSync(`npx openapi-typescript ${url} --output ${typesPath}`, {
      stdio: "inherit",
    });

    await fixTypesFile(typesPath);
  } catch (err) {
    console.error("Error:", err);
  }
})();
