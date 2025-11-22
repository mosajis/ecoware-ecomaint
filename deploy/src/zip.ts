import {zipFolder} from "./utils";
import path from "path";

export async function packageBuild(buildDir: string) {
  const zipPath = path.resolve("./build.zip");
  console.log(`🔹 Zipping build to ${zipPath}`);
  await zipFolder(buildDir, zipPath);
  return zipPath;
}
