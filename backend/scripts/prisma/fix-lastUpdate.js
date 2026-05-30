const fs = require("fs");
const path = require("path");

const schemaPath = path.resolve("./orm/schema.prisma");
let schema = fs.readFileSync(schemaPath, "utf-8");

// فقط lastUpdate رو فیکس کن
schema = schema.replace(
  /^\s*lastUpdate\s+DateTime[^\n]*/gm,
  `  lastUpdate   DateTime @updatedAt @map("lastUpdate")`,
);

fs.writeFileSync(schemaPath, schema, "utf-8");

console.log("✅ Updated existing lastUpdate fields");
