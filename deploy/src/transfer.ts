// @ts-ignore
import {NodeSSH} from "node-ssh";
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
  console.log(`🔹 Uploading zip to ${remoteDir}...`);
  await ssh.putFile(zipPath, path.posix.join(remoteDir, "build.zip"));

  console.log("🔹 Unzipping on server...");
  await ssh.execCommand(`
    cd ${remoteDir}
    unzip -o build.zip -d .
  `);

  ssh.dispose();
}
