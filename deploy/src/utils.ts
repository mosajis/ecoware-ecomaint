import { exec } from "child_process";
import fs from "fs-extra";
import path from "path";
import archiver from "archiver";

// اجرای دستور شل
export function runCommand(cmd: string, cwd?: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const p = exec(cmd, { cwd });
    p.stdout?.pipe(process.stdout);
    p.stderr?.pipe(process.stderr);
    p.on("exit", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`Command failed: ${cmd}`));
    });
  });
}

// zip کردن فولدر
export async function zipFolder(sourceDir: string, outPath: string) {
  await fs.ensureDir(path.dirname(outPath));
  return new Promise<void>((resolve, reject) => {
    const output = fs.createWriteStream(outPath);
    const archive = archiver("zip", { zlib: { level: 9 } });

    output.on("close", () => resolve());
    archive.on("error", (err) => reject(err));

    archive.pipe(output);
    archive.directory(sourceDir, false);
    archive.finalize();
  });
}
