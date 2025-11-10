const fs = require("fs");
const path = require("path");
const { getDMMF } = require("@prisma/internals");

const schemaPath = path.resolve("./orm/schema.prisma");
const outputPath = path.resolve("./src/routes/crud");

const excludeModels = [];

function camelCase(name) {
  return name.charAt(0).toLowerCase() + name.slice(1);
}

async function main() {
  const schema = fs.readFileSync(schemaPath, "utf-8");
  const dmmf = await getDMMF({ datamodel: schema });

  if (!fs.existsSync(outputPath)) fs.mkdirSync(outputPath, { recursive: true });

  const models = dmmf.datamodel.models
    .map((m) => m.name)
    .filter((m) => !excludeModels.includes(m));

  const exportedFiles = [];

  for (const modelName of models) {
    const camel = camelCase(modelName);
    const fileName = `${camel}.controller.ts`;
    const filePath = path.join(outputPath, fileName);

    exportedFiles.push(fileName.replace(/\.ts$/, "")); // جمع‌آوری برای index.ts

    if (fs.existsSync(filePath)) {
      console.log(`⚠️  Skipped (already exists): ${fileName}`);
      continue;
    }

    const content = `import { BaseController } from "@/utils/base.controller";
import { BaseService } from "@/utils/base.service";
import { PrismaClient } from "orm/generated/prisma";
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
    tags: ["${camel}"],
  },
  service: Service${modelName},
  createSchema: ${modelName}InputCreate,
  updateSchema: ${modelName}InputUpdate,
  responseSchema: buildResponseSchema(${modelName}Plain, ${modelName}),
}).app;

export default Controller${modelName}
`;

    fs.writeFileSync(filePath, content, "utf-8");
    console.log(`✅ Created: ${fileName}`);
  }

  const indexContent = exportedFiles
    .map((fileName) => {
      // تبدیل camelCase به PascalCase برای نام کنترلر
      const base = fileName.replace(".controller", "");
      const pascal = base.charAt(0).toUpperCase() + base.slice(1);
      return `export { default as Controller${pascal} } from "./${fileName}";`;
    })
    .join("\n");

  const indexPath = path.join(outputPath, "index.ts");
  fs.writeFileSync(indexPath, indexContent, "utf-8");

  console.log("✨ CRUD controller generation complete!");
  console.log("📦 index.ts generated successfully!");
}

main().catch((err) => {
  console.error("❌ Error generating CRUD controllers:", err);
  process.exit(1);
});
