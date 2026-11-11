const fs = require("fs");
const path = require("path");

const schemaPath = path.resolve("./orm/schema.prisma");

let schema = fs.readFileSync(schemaPath, "utf-8");

// اضافه کردن default(now()) و updatedAt برای تمام lastUpdate ها
schema = schema.replace(
  /^(\s*)lastUpdate\s+DateTime[^\n]*/gm,
  `$1lastUpdate DateTime @default(now()) @updatedAt @map("lastUpdate")`,
);

fs.writeFileSync(schemaPath, schema, "utf-8");

console.log("✅ Updated all existing lastUpdate fields");
