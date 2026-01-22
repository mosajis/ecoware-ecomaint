import path from "path";
import dotenv from "dotenv";
import { zipFolder } from "./utils";

dotenv.config();

const BUILD_DIR = path.resolve(process.env.BUILD_DIR!);

export async function zip() {
  const zipPath = path.resolve("./build.zip");
  console.log(`🔹 Zipping build to ${zipPath}`);
  await zipFolder(BUILD_DIR, zipPath);
  return zipPath;
}
