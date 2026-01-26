#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const schemaPath = path.resolve("./orm/schema.prisma");
const prismaboxDir = path.resolve("./orm/generated/prismabox");

/**
 * Log utility with timestamps
 */
function log(message, type = "info") {
  const timestamp = new Date().toLocaleTimeString("en-US");
  const icons = {
    info: "ℹ️",
    success: "✅",
    warn: "⚠️",
    error: "❌",
  };

  console.log(`${icons[type]} [${timestamp}] ${message}`);
}

/**
 * Extract DateTime field names from Prisma schema
 */
function extractDateTimeFields(schemaPath) {
  try {
    const content = fs.readFileSync(schemaPath, "utf-8");
    const dateTimeFields = new Set();

    const dateTimeMatches = content.matchAll(/(\w+)\s+DateTime/g);

    for (const match of dateTimeMatches) {
      dateTimeFields.add(match[1]);
    }

    return Array.from(dateTimeFields);
  } catch (error) {
    log(`Error reading schema: ${error.message}`, "error");
    return [];
  }
}

/**
 * Fix generated files to convert t.Date() to t.String() for DateTime fields
 */
function fixDateTimeInGeneratedFiles(generatedDir, dateTimeFields) {
  let fixedCount = 0;

  function walkDir(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        walkDir(fullPath);
        continue;
      }

      if (!entry.name.endsWith(".ts")) continue;

      let content = fs.readFileSync(fullPath, "utf-8");
      const original = content;
      let hasChanges = false;

      // For each DateTime field, replace t.Date() with t.String()
      for (const field of dateTimeFields) {
        // Pattern 1: fieldName: t.Date()
        const pattern1 = new RegExp(
          `(\\b${field}\\s*:\\s*)t\\.Date\\(\\)`,
          "g",
        );
        if (pattern1.test(content)) {
          content = content.replace(pattern1, `$1t.String()`);
          hasChanges = true;
        }

        // Pattern 2: fieldName: __nullable__(t.Date())
        const pattern2 = new RegExp(
          `(\\b${field}\\s*:\\s*)__nullable__\\(t\\.Date\\(\\)\\)`,
          "g",
        );
        if (pattern2.test(content)) {
          content = content.replace(pattern2, `$1__nullable__(t.String())`);
          hasChanges = true;
        }

        // Pattern 3: fieldName: t.Optional(__nullable__(t.Date()))
        const pattern3 = new RegExp(
          `(\\b${field}\\s*:\\s*)t\\.Optional\\(__nullable__\\(t\\.Date\\(\\)\\)\\)`,
          "g",
        );
        if (pattern3.test(content)) {
          content = content.replace(
            pattern3,
            `$1t.Optional(__nullable__(t.String()))`,
          );
          hasChanges = true;
        }

        // Pattern 4: fieldName: t.Optional(t.Date())
        const pattern4 = new RegExp(
          `(\\b${field}\\s*:\\s*)t\\.Optional\\(t\\.Date\\(\\)\\)`,
          "g",
        );
        if (pattern4.test(content)) {
          content = content.replace(pattern4, `$1t.Optional(t.String())`);
          hasChanges = true;
        }
      }

      if (hasChanges && content !== original) {
        fixedCount++;
        fs.writeFileSync(fullPath, content, "utf-8");
      }
    }
  }

  walkDir(generatedDir);
  return fixedCount;
}

/**
 * Main function
 */
function main() {
  try {
    if (!fs.existsSync(schemaPath)) {
      log(`Error: Schema file not found: ${schemaPath}`, "error");
      process.exit(1);
    }

    const dateTimeFields = extractDateTimeFields(schemaPath);

    if (dateTimeFields.length === 0) {
      process.exit(0);
    }

    if (!fs.existsSync(prismaboxDir)) {
      log(`Error: Directory not found: ${prismaboxDir}`, "error");
      process.exit(1);
    }

    fixDateTimeInGeneratedFiles(prismaboxDir, dateTimeFields);
  } catch (error) {
    log(`Error: ${error.message}`, "error");
    process.exit(1);
  }
}

main();
