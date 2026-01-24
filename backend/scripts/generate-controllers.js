#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const { getDMMF } = require("@prisma/internals");

const schemaPath = path.resolve("./orm/schema.prisma");
const outputPath = path.resolve("./src/routes/crud");

// Models to exclude from controller generation
const excludeModels = ["GetSysdiagrams", "Sysdiagrams"];
/**
 * Convert PascalCase to camelCase
 * @param {string} name - PascalCase string
 * @returns {string} camelCase string
 */
function camelCase(name) {
  return name.charAt(0).toLowerCase() + name.slice(1);
}

/**
 * Convert camelCase to PascalCase
 * @param {string} name - camelCase string
 * @returns {string} PascalCase string
 */
function pascalCase(name) {
  return name.charAt(0).toUpperCase() + name.slice(1);
}

/**
 * Generate CRUD controller template
 * @param {string} modelName - Model name in PascalCase
 * @param {string} primaryKey - Primary key field name
 * @returns {string} Controller code
 */
function generateControllerTemplate(modelName, primaryKey) {
  const camel = camelCase(modelName);

  return `import { BaseController } from "@/utils/base.controller";
import { BaseService } from "@/utils/base.service";
import {
  ${modelName},
  ${modelName}InputCreate,
  ${modelName}InputUpdate,
  ${modelName}Plain,
} from "orm/generated/prismabox/${modelName}";
import { buildResponseSchema } from "@/utils/base.schema";
import { prisma } from "@/utils/prisma";

export const Service${modelName} = new BaseService(prisma.${camel});

const Controller${modelName} = new BaseController({
  prefix: "/${camel}",
  swagger: {
    tags: ["${camelCase(modelName)}"],
  },
  primaryKey: "${primaryKey}",
  service: Service${modelName},
  createSchema: ${modelName}InputCreate,
  updateSchema: ${modelName}InputUpdate,
  responseSchema: buildResponseSchema(${modelName}Plain, ${modelName}),
}).app;

export default Controller${modelName};
`;
}

/**
 * Log utility with timestamps
 */
function log(message, type = "info") {
  const timestamp = new Date().toLocaleTimeString("en-US");
  const icons = {
    info: "ℹ️",
    success: "✅",
    skip: "⚠️",
    error: "❌",
  };

  console.log(`${icons[type]} [${timestamp}] ${message}`);
}

/**
 * Main controller generation function
 */
async function main() {
  try {
    // Read and parse Prisma schema
    const schema = fs.readFileSync(schemaPath, "utf-8");
    const dmmf = await getDMMF({ datamodel: schema });

    // Create output directory
    if (!fs.existsSync(outputPath)) {
      fs.mkdirSync(outputPath, { recursive: true });
    }

    // Get all models excluding specified ones
    const models = dmmf.datamodel.models
      .map((m) => {
        return m.name;
      })
      .filter((m) => !excludeModels.includes(m));

    const generatedFiles = [];

    // Generate controller for each model
    for (const modelName of models) {
      const camel = camelCase(modelName);
      const fileName = `${camel}.controller.ts`;
      const filePath = path.join(outputPath, fileName);

      generatedFiles.push(camel);

      // Skip if file already exists
      if (fs.existsSync(filePath)) {
        continue;
      }

      // Find primary key from DMMF
      const model = dmmf.datamodel.models.find((m) => m.name === modelName);
      const primaryField = model.fields.find((f) => f.isId);
      const primaryKey = primaryField ? primaryField.name : "id";

      // Generate and write controller file
      const content = generateControllerTemplate(modelName, primaryKey);
      fs.writeFileSync(filePath, content, "utf-8");
    }

    // Generate index.ts with all exports
    const indexContent = generatedFiles
      .map((fileName) => {
        const pascal = pascalCase(fileName);
        return `export { default as Controller${pascal} } from "./${fileName}.controller";`;
      })
      .join("\n");

    const indexPath = path.join(outputPath, "index.ts");
    fs.writeFileSync(indexPath, indexContent, "utf-8");
  } catch (error) {
    log(`Error generating controllers: ${error.message}`, "error");
    process.exit(1);
  }
}

main();
