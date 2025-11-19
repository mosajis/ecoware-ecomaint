// scripts/fix-prismaBox.js
import fs from "fs";
import path from "path";

// مسیر فولدر Prisma Box و فایل schema
const prismaboxDir = path.resolve("./orm/generated/prismabox");
const schemaPath = path.resolve("./orm/schema.prisma");

// 1️⃣ استخراج primary key ها از schema.prisma
function parseSchemaPrimaryKeys(schemaFile) {
  const schema = fs.readFileSync(schemaFile, "utf-8");
  const pkMap = {};

  const modelRegex = /model\s+(\w+)\s+{([\s\S]*?)}/g;
  let match;
  while ((match = modelRegex.exec(schema))) {
    const modelName = match[1];
    const body = match[2];

    const pkRegex = /(\w+)\s+[\w\[\]]+\s+@id\b/g;
    const pkMatch = pkRegex.exec(body);
    if (pkMatch) {
      pkMap[modelName] = pkMatch[1]; // modelName -> primary key field
    }
  }

  return pkMap;
}

// 2️⃣ اصلاح فایل‌ها
function fixFile(filePath, pkMap) {
  let content = fs.readFileSync(filePath, "utf-8");

  // regex ساده برای پیدا کردن connect.id و disconnect.id
  // و تبدیل آن به connect.<PK> / disconnect.<PK>
  for (const [modelName, pk] of Object.entries(pkMap)) {
    const connectRegex = new RegExp(
      `(connect:\\s*t\\.Object\\(\\s*{)\\s*id:`,
      "g"
    );
    content = content.replace(connectRegex, `$1 ${pk}:`);

    const disconnectRegex = new RegExp(
      `(disconnect:\\s*t\\.Array\\(\\s*t\\.Object\\(\\s*{)\\s*id:`,
      "g"
    );
    content = content.replace(disconnectRegex, `$1 ${pk}:`);
  }

  fs.writeFileSync(filePath, content, "utf-8");
  console.log(`✅ Fixed ${filePath}`);
}

// 3️⃣ پیمایش فولدر Prisma Box
function walkDir(dir, pkMap) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkDir(fullPath, pkMap);
    } else if (entry.name.endsWith(".ts")) {
      fixFile(fullPath, pkMap);
    }
  }
}

// اجرای کل فرآیند
const pkMap = parseSchemaPrimaryKeys(schemaPath);
walkDir(prismaboxDir, pkMap);
console.log("🎉 All Prisma Box files updated with correct PK in relations!");
