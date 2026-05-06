import fs from "fs";
import path from "path";

const typesPath = path.resolve("./src/core/api/generated/api.types.ts");
const outputPath = path.resolve("./src/core/api/generated/api.ts");

// خواندن فایل types
const typesContent = fs.readFileSync(typesPath, "utf-8");

// لیست ریسورس‌هایی که نباید ساخته شوند
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
  "health",
  "index",
  "statistics",
  "tblFailureReportFull",
  "tblFailureReportByFailureReportIdFull",
  "tblAttachmentByAttachmentIdDownload",
  "tblMaintLogSpareUniqueSpareUnit",
  "tblMaintLogContext",
];

// helper camelCase
function camelCase(str) {
  return str
    .replace(/[-_/](.)/g, (_, c) => c.toUpperCase())
    .replace(/^./, (c) => c.toLowerCase());
}

// regex برای پیدا کردن عملیات
const opRegex = /(get|post|put|delete)([A-Z][a-zA-Z0-9_]*)\s*:/g;
const resourcesMap = {};

let match;
while ((match = opRegex.exec(typesContent)) !== null) {
  const method = match[1]; // get/post/put/delete
  const name = match[2]; // مثل SysdiagramsByDiagramId

  // شناسایی اسم ریسورس واقعی (حذف ByXId و Count)
  const resourceName = camelCase(
    name.replace(/By[A-Z].*Id$/, "").replace(/Count$/, ""),
  );

  if (!resourcesMap[resourceName]) resourcesMap[resourceName] = {};
  resourcesMap[resourceName][method] = resourcesMap[resourceName][method] || [];
  resourcesMap[resourceName][method].push(match[0].split(":")[0]);
}

// === تولید خروجی ===
let output = `// ⚠️ Auto-generated file. Do not edit manually.
import { api } from '@/service/axios';
import type { DynamicResponse, DynamicQuery, DynamicCreate, DynamicUpdate } from '../dynamicTypes';

// 🔥 Utility برای stringify خودکار query parameters
// این تابع filter, include, select و سایر objectها را به JSON string تبدیل می‌کند
function stringifyQuery<Q extends Record<string, any>>(query?: Q) {
  if (!query) return query;
  const result: Record<string, any> = {};
  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && typeof value === "object") {
      result[key] = JSON.stringify(value);
    } else {
      result[key] = value;
    }
  });
  return result as Q;
}

`;

for (const [resource, ops] of Object.entries(resourcesMap)) {
  if (ignoreResources.includes(resource)) {
    console.log(`🚫 Ignored: ${resource}`);
    continue;
  }

  const getOps = ops.get || [];
  let getAllOp = getOps.find((x) => !/By[A-Z].*Id$|Count/i.test(x));
  if (!getAllOp) {
    const expected = "get" + resource[0].toUpperCase() + resource.slice(1);
    getAllOp = getOps.find((x) => x === expected);
  }

  const typeName = resource[0].toUpperCase() + resource.slice(1);
  if (getAllOp) {
    output += `export type Type${typeName} = DynamicResponse<'${getAllOp}'>['items'][0];\n`;
  }

  output += `export const ${resource} = {\n`;

  const getByIdOp = getOps.find((x) => /By[A-Z].*Id$/.test(x));
  const countOp = getOps.find((x) => /Count/i.test(x));

  // getAll - supports: filter, include, select, sort, page, perPage, paginate
  if (getAllOp)
    output += `  getAll: (query?: DynamicQuery<'${getAllOp}'>) =>
    api.get<DynamicResponse<'${getAllOp}'>>('/${resource}', { params: stringifyQuery(query) }),\n`;

  // getById - supports: include, select
  if (getByIdOp)
    output += `  getById: (id: number, query?: DynamicQuery<'${getByIdOp}'>) =>
    api.get<DynamicResponse<'${getByIdOp}'>>(\`/${resource}/\${id}\`, { params: stringifyQuery(query) }),\n`;

  if (countOp)
    output += `  count: (query?: DynamicQuery<'${countOp}'>) =>
    api.get<DynamicResponse<'${countOp}'>>('/${resource}/count', { params: stringifyQuery(query) }),\n`;

  const postOp = ops.post?.[0];
  if (postOp)
    output += `  create: (data: DynamicCreate<'${postOp}'>) =>
    api.post<DynamicResponse<'${postOp}'>>('/${resource}', { data }),\n`;

  // update - supports: include, select
  const putOp = ops.put?.find((x) => /By[A-Z].*Id$/.test(x)) || ops.put?.[0];
  const queryType = getByIdOp;

  const queryParam = queryType
    ? `query?: DynamicQuery<'${queryType}'>`
    : `query?: never`;
  if (putOp)
    output += `  update: (id: number, data: DynamicUpdate<'${putOp}'>, ${queryParam}) =>
    api.put<DynamicResponse<'${putOp}'>>(\`/${resource}/\${id}\`, { data, params: stringifyQuery(${queryParam ? "query" : "{}"}) }),\n`;

  const delOps = ops.delete || [];
  const delById = delOps.find((x) => /By[A-Z].*Id$/.test(x));
  const delAll = delOps.find((x) => !/By[A-Z].*Id$/.test(x));

  if (delById)
    output += `  deleteById: (id: number, query?: DynamicQuery<'${delById}'>) =>
    api.delete<DynamicResponse<'${delById}'>>(\`/${resource}/\${id}\`, { params: stringifyQuery(query) }),\n`;

  if (delAll)
    output += `  deleteAll: (query?: DynamicQuery<'${delAll}'>) =>
    api.delete<DynamicResponse<'${delAll}'>>('/${resource}', { params: stringifyQuery(query) }),\n`;

  output += `};\n\n`;
}

// ذخیره فایل خروجی
fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, output, "utf-8");

console.log(
  `✅ API generated for ${Object.keys(resourcesMap).length} resources`,
);
console.log(`📦 Supports: filter, include, select, sort, pagination`);
