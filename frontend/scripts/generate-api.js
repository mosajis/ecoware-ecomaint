// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import fs from "fs";
import path from "path";

const typesPath = path.resolve("./src/core/api/generated/api.types.ts");
const outputPath = path.resolve("./src/core/api/generated/api.ts");

const typesContent = fs.readFileSync(typesPath, "utf-8");

// ✅ لیست ریسورس‌هایی که باید نادیده گرفته شوند
const ignoreResources = [
  "id",
  "format",
  "codeId",
  "code",
  "onRotation",
  "codeDefId",
  "authLogin",
  "authRegister",
  "authLogout",
  "authAuthorization",
];

// تابع camelCase
function camelCase(str) {
  return str
    .replace(/[-_/](.)/g, (_, c) => c.toUpperCase())
    .replace(/^./, (c) => c.toLowerCase());
}

// متدها را از interface استخراج می‌کنیم
const opRegex = /(get|post|put|delete)([A-Z][a-zA-Z0-9_]*)\s*:/g;
const resourcesMap = {};

let match;
while ((match = opRegex.exec(typesContent)) !== null) {
  const method = match[1];
  const name = match[2]; // مثل TblLocationById
  const resourceName = camelCase(name.replace(/ById|Count$/, "")); // TblLocation → tblLocation

  if (!resourcesMap[resourceName]) resourcesMap[resourceName] = {};
  resourcesMap[resourceName][method] = resourcesMap[resourceName][method] || [];

  resourcesMap[resourceName][method].push(match[0].split(":")[0]); // مثل getTblLocationById
}

// تولید کد خروجی
let output = `// ⚠️ Auto-generated file. Do not edit manually.
import { api } from '@/service/axios';
import type { DynamicResponse, DynamicQuery, DynamicCreate, DynamicUpdate } from '../dynamicTypes';

`;

for (const [resource, ops] of Object.entries(resourcesMap)) {
  // ✅ اگر در ignore list بود، رد شو
  if (ignoreResources.includes(resource)) {
    console.log(`🚫 Ignored: ${resource}`);
    continue;
  }
  const getOps = ops.get || [];

  // 1) اول دنبال getAll واقعی می‌گردیم
  let getAllOp = getOps.find((x) => !/ById|Count/i.test(x));

  if (!getAllOp) {
    const expectedName = "get" + resource[0].toUpperCase() + resource.slice(1);
    getAllOp = getOps.find((x) => x === expectedName);
  }

  // اگر باز هم پیدا نشد، یعنی این ریسورس اصلا get ندارد → type نزنیم
  const typeName = resource[0].toUpperCase() + resource.slice(1);

  if (getAllOp) {
    output += `export type Type${typeName} = DynamicResponse<'${getAllOp}'>['items'][0];\n`;
  }

  output += `export const ${resource} = {\n`;

  const getByIdOp = getOps.find((x) => /ById/i.test(x));
  const countOp = getOps.find((x) => /Count/i.test(x));

  if (getAllOp)
    output += `  getAll: (query?: DynamicQuery<'${getAllOp}'>) => api.get<DynamicResponse<'${getAllOp}'>>('/${resource}', { params: query }),\n`;
  if (getByIdOp)
    output += `  getById: (id: number, query?: DynamicQuery<'${getByIdOp}'>) => api.get<DynamicResponse<'${getByIdOp}'>>(\`/${resource}/\${id}\`, { params: query }),\n`;
  if (countOp)
    output += `  count: (query?: DynamicQuery<'${countOp}'>) => api.get<DynamicResponse<'${countOp}'>>('/${resource}/count', { params: query }),\n`;

  // POST
  const postOp = ops.post?.[0];
  if (postOp)
    output += `  create: (data: DynamicCreate<'${postOp}'>) => api.post<DynamicResponse<'${postOp}'>>('/${resource}', { data }),\n`;

  // PUT
  const putOp = ops.put?.find((x) => /ById/i.test(x)) || ops.put?.[0];
  if (putOp)
    output += `  update: (id: number, data: DynamicUpdate<'${putOp}'>) => api.put<DynamicResponse<'${putOp}'>>(\`/${resource}/\${id}\`, { data }),\n`;

  // DELETE
  const delOps = ops.delete || [];
  const delById = delOps.find((x) => /ById/i.test(x));
  const delAll = delOps.find((x) => !/ById/i.test(x));

  if (delById)
    output += `  deleteById: (id: number, query?: DynamicQuery<'${delById}'>) => api.delete<DynamicResponse<'${delById}'>>(\`/${resource}/\${id}\`, { params: query }),\n`;
  if (delAll)
    output += `  deleteAll: (query?: DynamicQuery<'${delAll}'>) => api.delete<DynamicResponse<'${delAll}'>>('/${resource}', { params: query }),\n`;

  output += `};\n\n`;
}

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, output, "utf-8");

console.log(
  `✅ API generated for ${Object.keys(resourcesMap).length} resources`
);
