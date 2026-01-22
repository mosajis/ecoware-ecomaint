import dotenv from "dotenv";
import { buildAll } from "./build";
import { zip } from "./zip";

dotenv.config();

buildAll();
zip();
