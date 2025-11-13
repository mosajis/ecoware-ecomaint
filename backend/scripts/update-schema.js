const fs = require("fs");
const path = require("path");

const schemaPath = path.resolve("./orm/schema.prisma");
let schema = fs.readFileSync(schemaPath, "utf-8");

// 🗺️ Map از مدل به آرایه فیلدها و sequenceها
const sequenceMap = {
  TblLocation: [{ field: "locationId", sequence: "seq_location" }],
};

// 🎯 پردازش مدل‌ها
schema = schema.replace(
  /model\s+(\w+)\s+\{([^}]+)\}/gm,
  (match, modelName, body) => {
    const configs = sequenceMap[modelName];

    if (!configs) return match;
    configs.forEach((config) => {
      const fieldRegex = new RegExp(`^\\s*${config.field}\\s+\\w+[^\n]*`, "gm");

      if (fieldRegex.test(body)) {
        body = body.replace(
          fieldRegex,
          `  ${config.field} Int @id @default(sequence("${config.sequence}"))`
        );
        console.log(`✅ Sequence added for ${modelName}.${config.field}`);
      } else {
        console.warn(
          `⚠️ Field "${config.field}" not found in model "${modelName}"`
        );
      }
    });

    return `model ${modelName} {\n${body}\n}`;
  }
);

// 📝 نوشتن فایل
fs.writeFileSync(schemaPath, schema, "utf-8");
console.log("✨ All mapped sequences applied successfully!");
