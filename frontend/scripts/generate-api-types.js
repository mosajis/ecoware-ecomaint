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
            new Error(
              `Failed to download. Status code: ${response.statusCode}`,
            ),
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

  // 1️⃣ (Record<string, never> | string | number) => string
  content = content.replace(
    /\(\s*Record<string,\s*never>\s*\|\s*string\s*\|\s*number\s*\)/g,
    "string",
  );

  // حالت بدون پرانتز
  content = content.replace(
    /Record<string,\s*never>\s*\|\s*string\s*\|\s*number/g,
    "string",
  );

  // 2️⃣ (string | number) => number
  content = content.replace(/\(\s*string\s*\|\s*number\s*\)/g, "number");

  // حالت بدون پرانتز
  content = content.replace(/string\s*\|\s*number/g, "number");

  await fsp.writeFile(path, content, "utf-8");
  console.log("[generate-api-types] Fixed generated types.");
}

(async () => {
  try {
    await download(url, outputPath);
    console.log("[generate-api-types] Downloaded OpenAPI spec.");

    execSync(`npx openapi-typescript ${url} --output ${typesPath}`, {
      stdio: "inherit",
    });

    await fixTypesFile(typesPath);
  } catch (err) {
    console.error("Error:", err);
  }
})();
