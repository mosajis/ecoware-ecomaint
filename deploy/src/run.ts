import {NodeSSH} from "node-ssh";
import dotenv from "dotenv";

dotenv.config();

export async function runBackend(port: number) {
  const ssh = new NodeSSH();
  await ssh.connect({
    host: process.env.SERVER_HOST!,
    username: process.env.SERVER_USER!,
    password: process.env.SERVER_PASSWORD!,
  });

  const remoteDir = process.env.REMOTE_DIR!;
  console.log(`🔹 Starting backend on port ${port}...`);
  await ssh.execCommand(`
    cd ${remoteDir}
    pm2 stop backend-${port} || true
    pm2 start build/index.js --name backend-${port} -- -p ${port}
    pm2 save
  `);

  ssh.dispose();
}
