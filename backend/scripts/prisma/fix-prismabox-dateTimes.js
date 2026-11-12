#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const schemaPath = path.resolve("./orm/schema.prisma");
const prismaboxDir = path.resolve("./orm/generated/prismabox");

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
 * Extract DateTime fields and detect automatically managed fields.
 *
 * A field with @default(...) or @updatedAt does not need to be
 * supplied by the API client.
 */
function extractDateTimeFields(schemaPath) {
  try {
    const content = fs.readFileSync(schemaPath, "utf-8");

    const dateTimeFields = new Set();
    const autoManagedFields = new Set();

    // Read line by line because Prisma fields are normally declared
    // on a single line.
    for (const line of content.split(/\r?\n/)) {
      const match = line.match(/^\s*(\w+)\s+DateTime\b(.*)$/);

      if (!match) continue;

      const [, fieldName, attributes] = match;

      dateTimeFields.add(fieldName);

      if (
        attributes.includes("@default(") ||
        attributes.includes("@updatedAt")
      ) {
        autoManagedFields.add(fieldName);
      }
    }

    return {
      dateTimeFields: Array.from(dateTimeFields),
      autoManagedFields: Array.from(autoManagedFields),
    };
  } catch (error) {
    log(`Error reading schema: ${error.message}`, "error");

    return {
      dateTimeFields: [],
      autoManagedFields: [],
    };
  }
}

/**
 * Fix generated files.
 *
 * 1. Convert DateTime from t.Date() to t.String()
 * 2. Make Prisma-managed fields optional.
 */
function fixDateTimeInGeneratedFiles(
  generatedDir,
  dateTimeFields,
  autoManagedFields,
) {
  let fixedCount = 0;

  const autoManagedSet = new Set(autoManagedFields);

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

      // -----------------------------------
      // Step 1: Convert DateTime -> String
      // -----------------------------------
      for (const field of dateTimeFields) {
        const escapedField = field.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

        // field: t.Date()
        content = content.replace(
          new RegExp(`(\\b${escapedField}\\s*:\\s*)t\\.Date\\(\\)`, "g"),
          "$1t.String()",
        );

        // field: __nullable__(t.Date())
        content = content.replace(
          new RegExp(
            `(\\b${escapedField}\\s*:\\s*)__nullable__\\(t\\.Date\\(\\)\\)`,
            "g",
          ),
          "$1__nullable__(t.String())",
        );

        // field: t.Optional(t.Date())
        content = content.replace(
          new RegExp(
            `(\\b${escapedField}\\s*:\\s*)t\\.Optional\\(t\\.Date\\(\\)\\)`,
            "g",
          ),
          "$1t.Optional(t.String())",
        );

        // field: t.Optional(__nullable__(t.Date()))
        content = content.replace(
          new RegExp(
            `(\\b${escapedField}\\s*:\\s*)t\\.Optional\\(__nullable__\\(t\\.Date\\(\\)\\)\\)`,
            "g",
          ),
          "$1t.Optional(__nullable__(t.String()))",
        );
      }

      // -----------------------------------
      // Step 2: Make auto-managed fields optional
      // -----------------------------------
      for (const field of autoManagedSet) {
        const escapedField = field.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

        // field: t.String()
        content = content.replace(
          new RegExp(`(\\b${escapedField}\\s*:\\s*)t\\.String\\(\\)`, "g"),
          "$1t.Optional(t.String())",
        );

        // field: __nullable__(t.String())
        content = content.replace(
          new RegExp(
            `(\\b${escapedField}\\s*:\\s*)__nullable__\\(t\\.String\\(\\)\\)`,
            "g",
          ),
          "$1t.Optional(__nullable__(t.String()))",
        );
      }

      if (content !== original) {
        fixedCount++;
        fs.writeFileSync(fullPath, content, "utf-8");
      }
    }
  }

  walkDir(generatedDir);

  return fixedCount;
}

function main() {
  try {
    if (!fs.existsSync(schemaPath)) {
      log(`Schema file not found: ${schemaPath}`, "error");
      process.exit(1);
    }

    if (!fs.existsSync(prismaboxDir)) {
      log(`Directory not found: ${prismaboxDir}`, "error");
      process.exit(1);
    }

    const { dateTimeFields, autoManagedFields } =
      extractDateTimeFields(schemaPath);

    if (dateTimeFields.length === 0) {
      log("No DateTime fields found.", "warn");
      return;
    }

    const fixedCount = fixDateTimeInGeneratedFiles(
      prismaboxDir,
      dateTimeFields,
      autoManagedFields,
    );

    log(
      `Fixed ${fixedCount} generated file(s). ` +
        `Found ${dateTimeFields.length} DateTime field(s), ` +
        `${autoManagedFields.length} auto-managed field(s).`,
      "success",
    );
  } catch (error) {
    log(`Error: ${error.message}`, "error");
    process.exit(1);
  }
}

main();
