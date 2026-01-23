import dotenv from "dotenv";
import { buildAll } from "./build";
import { zip } from "./zip";
import { transferZip } from "./transfer";

dotenv.config();

const buildDir = await buildAll();
const zipPath = await zip();
await transferZip("./build.zip");
