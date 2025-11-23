import fs from "fs";
import path from "path";

const schemaPath = path.resolve("./orm/schema.prisma");
let schema = fs.readFileSync(schemaPath, "utf-8");

schema = schema
  .replace(
    /^\s*createdAt\s+DateTime[^\n]*/gm,
    `  createdAt   DateTime @default(now()) @map("created_at")`
  )

  .replace(
    /^\s*updatedAt\s+DateTime[^\n]*/gm,
    `  lastupdate  DateTime @updatedAt`
  );

fs.writeFileSync(schemaPath, schema, "utf-8");

console.log("✅ Updated existing createdAt and updatedAt fields");
