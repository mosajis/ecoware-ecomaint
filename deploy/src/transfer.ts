// @ts-ignore
import { NodeSSH } from "node-ssh";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

const ssh = new NodeSSH();

export async function transferZip(zipPath: string) {
  await ssh.connect({
    host: process.env.SERVER_HOST!,
    username: process.env.SERVER_USER!,
    password: process.env.SERVER_PASSWORD!,
  });

  const remoteDir = process.env.REMOTE_DIR!;
  const remotePath = path.posix.join(remoteDir, "build.zip");

  console.log(`🔹 Uploading zip to ${remoteDir}...`);

  await ssh.putFile(zipPath, remotePath, undefined, {
    step: (transferred: any, chunk: any, total: any) => {
      const percent = Math.floor((transferred / total) * 100);
      process.stdout.write(
        `\r📦 Uploading: ${percent}% (${(transferred / 1024 / 1024).toFixed(2)}MB / ${(total / 1024 / 1024).toFixed(2)}MB)`,
      );
    },
  });

  console.log("\n✅ Upload completed");

  ssh.dispose();
}
