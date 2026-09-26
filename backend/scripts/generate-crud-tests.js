#!/usr/bin/env node
/**
 * Same approach as scripts/generate-controllers.js, which builds controllers
 * from orm/schema.prisma (the same schema referenced by prisma.config.ts).
 * For every model that has a real CRUD controller under src/routes/crud,
 * this script generates an integration test file built on crudTestFactory.ts.
 *
 * Run (sibling of the existing "prisma" script in package.json):
 *   bun run scripts/generate-crud-tests.js
 *
 * Behaves like generate-controllers.js: if a test file already exists,
 * it's left untouched (skipped) so your manual edits aren't overwritten.
 */
const fs = require("fs");
const path = require("path");
const { getDMMF } = require("@prisma/internals");

const schemaPath = path.resolve("./orm/schema.prisma");
const crudControllersPath = path.resolve("./src/routes/crud");
const outputPath = path.resolve("./src/tests/generated");

// Models that don't have a CRUD controller / we don't want auto-generated tests for
const excludeModels = ["GetSysdiagrams", "Sysdiagrams"];

function camelCase(name) {
  return name.charAt(0).toLowerCase() + name.slice(1);
}

/** Builds a sample value for a scalar field based on its type */
function sampleValueForField(modelName, field) {
  switch (field.type) {
    case "String":
      return `\`Test ${modelName} \${Date.now()}\``;
    case "Int":
    case "BigInt":
      return `Date.now() % 1000000`;
    case "Float":
    case "Decimal":
      return `1`;
    case "Boolean":
      return `true`;
    case "DateTime":
      return `new Date().toISOString()`;
    default:
      return `undefined /* TODO: provide a suitable value for type=${field.type} */`;
  }
}

/**
 * Extracts the fields needed for the create body from the DMMF:
 * only required scalar fields with no default (createSchema likely requires them too).
 */
function buildCreateFieldsSource(modelName, model, primaryKey) {
  const lines = [];

  for (const field of model.fields) {
    if (field.kind !== "scalar") continue; // relations are handled separately
    if (field.name === primaryKey && field.hasDefaultValue) continue; // PK with sequence/dbgenerated
    if (field.hasDefaultValue) continue; // @default / @updatedAt fill themselves in
    if (!field.isRequired) continue; // optional, no need to send it

    const looksLikeForeignKey =
      field.name === primaryKey
        ? false
        : /Id$/.test(field.name) &&
          (field.type === "Int" || field.type === "BigInt");

    if (looksLikeForeignKey) {
      lines.push(
        `    ${field.name}: 1 /* TODO: set a real, existing ${field.name} in the test database (foreign key) */,`,
      );
      continue;
    }

    lines.push(`    ${field.name}: ${sampleValueForField(modelName, field)},`);
  }

  return lines.join("\n");
}

/** Finds a non-primary-key string field to use for update (if any) */
function pickUpdateField(model, primaryKey) {
  const stringField = model.fields.find(
    (f) => f.kind === "scalar" && f.type === "String" && f.name !== primaryKey,
  );
  return stringField ? stringField.name : null;
}

function generateTestTemplate(modelName, model, primaryKey) {
  const camel = camelCase(modelName);
  const createFields = buildCreateFieldsSource(modelName, model, primaryKey);
  const updateField = pickUpdateField(model, primaryKey);

  const updatePayload = updateField
    ? `{ ${updateField}: \`Updated \${Date.now()}\` }`
    : `{} /* TODO: this model has no suitable string field for the update test, fill it in manually */`;

  return `
import { runCrudIntegrationTests } from "../utils/crudTestFactory";

runCrudIntegrationTests({
  name: "${camel}",
  path: "/${camel}",
  primaryKey: "${primaryKey}",
  buildCreatePayload: () => ({
${createFields || "    // TODO: this model has no required field without a default; add one manually if needed"}
  }),
  buildUpdatePayload: () => (${updatePayload}),
});
`;
}

function log(message, type = "info") {
  const icons = { info: "ℹ️", success: "✅", skip: "⚠️", error: "❌" };
  console.log(`${icons[type] ?? "ℹ️"} ${message}`);
}

async function main() {
  const schema = fs.readFileSync(schemaPath, "utf-8");
  const dmmf = await getDMMF({ datamodel: schema });

  if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath, { recursive: true });
  }

  const models = dmmf.datamodel.models.filter(
    (m) => !excludeModels.includes(m.name),
  );

  let generated = 0;
  let skippedNoController = 0;
  let skippedExists = 0;

  for (const model of models) {
    const camel = camelCase(model.name);
    const controllerPath = path.join(
      crudControllersPath,
      `${camel}.controller.ts`,
    );

    // Only generate a test for models that are actually reachable via a CRUD route
    if (!fs.existsSync(controllerPath)) {
      skippedNoController++;
      continue;
    }

    const testFilePath = path.join(outputPath, `${camel}.test.ts`);
    if (fs.existsSync(testFilePath)) {
      skippedExists++;
      continue;
    }

    const primaryField = model.fields.find((f) => f.isId);
    const primaryKey = primaryField ? primaryField.name : "id";

    const content = generateTestTemplate(model.name, model, primaryKey);
    fs.writeFileSync(testFilePath, content, "utf-8");
    generated++;
  }

  log(`${generated} new test file(s) generated.`, "success");
  log(
    `${skippedExists} file(s) already existed and were left untouched.`,
    "info",
  );
  log(
    `${skippedNoController} model(s) had no CRUD controller and were skipped.`,
    "info",
  );

  if (generated > 0) {
    log(
      `New files were written under tests/generated/. Review every "TODO" line before running the tests (foreign keys especially).`,
      "info",
    );
  }
}

main().catch((error) => {
  log(`Error: ${error.message}`, "error");
  process.exit(1);
});
