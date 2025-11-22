const fs = require("fs");
const path = require("path");

const schemaPath = path.resolve("./orm/schema.prisma");
let schema = fs.readFileSync(schemaPath, "utf-8");

export const sequenceMap = {
  // TblAddress: [
  //   {
  //     field: "addressId",
  //     replacement:
  //       'addressId Int @id(map: "PK_tblAddress") @default(dbgenerated("NEXT VALUE FOR [Seq_Address]"), map: "DF_tbladdress_ID") @map("AddressID")',
  //   },
  // ],
};

schema = schema.replace(
  /model\s+(\w+)\s+\{([\s\S]*?)\n\}/gm,
  (match, modelName, body) => {
    const configs = sequenceMap[modelName];
    if (!configs) return match;

    configs.forEach(({ field, replacement }) => {
      // regex برای پیدا کردن خط فیلد
      const fieldRegex = new RegExp(`^\\s*${field}.*$`, "gm");
      body = body.replace(fieldRegex, replacement);
    });

    return `model ${modelName} {\n${body}\n}`;
  }
);

fs.writeFileSync(schemaPath, schema, "utf-8");
console.log("✨ All fields replaced with correct sequence lines!");
