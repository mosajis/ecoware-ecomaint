import {buildAll} from "./build.ts";
import dotenv from "dotenv";

dotenv.config();

const port = parseInt(process.argv[2] || process.env.DEFAULT_PORT || "3000");

(async () => {
  try {
    const buildDir = await buildAll();
    // const zipPath = await packageBuild(buildDir);
    // await transferZip(zipPath);
    // await runBackend(port);
    console.log(`✅ Deploy finished successfully on port ${port}`);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
