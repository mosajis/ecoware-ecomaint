import path from "path";
import dotenv from "dotenv";
import {runCommand} from "./utils.ts";

dotenv.config();

const FRONTEND_DIR = path.resolve(process.env.FRONTEND_DIR!);
const BACKEND_DIR = path.resolve(process.env.BACKEND_DIR!);
const BUILD_DIR = path.resolve(process.env.BUILD_DIR!);

export async function buildAll() {
  console.log("🔹 Building frontend...");
  await runCommand("bun run build", FRONTEND_DIR);

  console.log("🔹 Building backend...");
  await runCommand("bun run build", BACKEND_DIR);

  console.log("✅ Build completed.");
  return BUILD_DIR;
}
