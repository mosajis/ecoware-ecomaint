import { sequenceMap } from "./update-scehma-seq";

const fs = require("fs");
const path = require("path");

const schemaPath = path.resolve("./orm/schema.prisma");
let schema = fs.readFileSync(schemaPath, "utf-8");

schema = schema.replace(
  /model\s+(\w+)\s+\{([\s\S]*?)\n\}/gm,
  (match, modelName, body) => {
    const configs = sequenceMap[modelName];
    if (!configs) return match;

    configs.forEach(({ field, replacement }) => {
      // regex برای پیدا کردن خط فیلد
      const fieldRegex = new RegExp(`^\\s*${field}.*$`, "gm");
      body = body.replace(fieldRegex, replacement);
    });

    return `model ${modelName} {\n${body}\n}`;
  }
);

fs.writeFileSync(schemaPath, schema, "utf-8");
console.log("✨ All fields replaced with correct sequence lines!");
