const fs = require("fs");
const path = require("path");
const _ = require("lodash");

const TablePKs = {
  TblAddress: "AddressID",
  TblCompCounter: "CompCounterID",
  TblCompCounterLog: "CompCounterLogID",
  TblCompJob: "CompJobID",
  TblCompJobCounter: "CompJobCounterID",
  TblCompJobMeasurePoint: "CompJobMeasurePointID",
  TblCompJobTrigger: "CompJobTriggerID",
  TblCompMeasurePoint: "CompMeasurePointID",
  TblCompMeasurePointLog: "CompMeasurePointLogID",
  TblCompOilInfo: "CompOilInfoID",
  TblComponentUnit: "CompID",
  TblCompSpare: "CompSpareID",
  TblCompStatus: "CompStatusId",
  TblCompStatusLog: "CompStatusLogID",
  TblCompType: "CompTypeID",
  TblCompTypeCounter: "CompTypeCounterID",
  TblCompTypeJob: "CompTypeJobID",
  TblCompTypeJobCounter: "CompTypeJobCounterID",
  TblCompTypeJobMeasurePoint: "CompTypeJobMeasurePointID",
  TblCompTypeJobTrigger: "CompTypeJobTriggerID",
  TblCompTypeMeasurePoint: "CompTypeMeasurePointID",
  TblCounterType: "CounterTypeID",
  TblDepartment: "DeptID",
  TblDiscipline: "DiscID",
  TblEmployee: "EmployeeID",
  TblFailureReports: "FailureReportId",
  TblFollowStatus: "FollowStatusID",
  TblFunctions: "FunctionID",
  TblJobClass: "JobClassID",
  TblJobDescription: "JobDescID",
  TblJobTrigger: "JobTriggerID",
  TblJobTrigger_Log: "JobTriggerLogID",
  TblJobVersion: "JobVersionID",
  TblLocation: "LocationID",
  TblLogCounter: "LogCounterID",
  TblLogDiscipline: "LogDiscID",
  TblLoginAudit: "LoginAuditID",
  TblMaintCause: "MaintCauseID",
  TblMaintClass: "MaintClassID",
  TblMaintLog: "MaintLogID",
  TblMaintLog_Stocks: "MaintLogStockId",
  TblMaintLogFollow: "FollowID",
  TblMaintType: "MaintTypeID",
  TblOilSamplingLog: "OilSamplingLogID",
  TblPendingType: "PendTypeId",
  TblReScheduleLog: "RescheduleLogID",
  TblRotationLog: "RotationLogID",
  TblRound: "RoundID",
  TblRoundCompJob: "RoundCompJobID",
  TblSpareType: "PartTypeID",
  TblSpareUnit: "PartID",
  TblUnit: "UnitID",
  TblWorkOrder: "WorkOrderID",
  TblWorkShopComponent: "WShopCompID",
  TblWorkShopDone: "WShopDoneID",
  TblWorkShopRequest: "WShopRequestID",
  Users: "UserID",
};

const prismaboxDir = path.resolve("./orm/generated/prismabox");
const maxDepth = 5; // حداکثر depth برای nested relations

let fixedCount = 0;
let modelCache = {}; // کش برای relations هر model

// ساخت reverse mapping
function buildFieldToPKMap() {
  const map = {};
  for (const [tableName, pk] of Object.entries(TablePKs)) {
    const fieldNameBase =
      tableName.charAt(0).toLowerCase() + tableName.slice(1);
    map[fieldNameBase] = _.camelCase(pk);
    if (!fieldNameBase.endsWith("s")) {
      map[fieldNameBase + "s"] = _.camelCase(pk);
    }
  }
  return map;
}

// استخراج relations از یک model
function extractRelationsFromFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, "utf-8");
    const relations = [];

    // پیدا کردن export const XXXRelations یا XXXInputCreate و XXXInputUpdate
    const relationMatches = content.match(
      /tbl[A-Za-z_]+:\s*(?:t\.Partial\s*\()?(?:t\.Optional\s*\()?(?:t\.Array\s*\()?t\.Object\s*\(/g
    );

    if (relationMatches) {
      const fields = relationMatches
        .map((m) => {
          const fieldMatch = m.match(/tbl[A-Za-z_]+/);
          return fieldMatch ? fieldMatch[0] : null;
        })
        .filter(Boolean);

      return [...new Set(fields)];
    }

    return relations;
  } catch (e) {
    return [];
  }
}

// پیدا کردن فایل برای یک model
function findModelFile(modelName) {
  try {
    const filename = `${modelName}.ts`;
    const filePath = path.join(prismaboxDir, filename);
    if (fs.existsSync(filePath)) {
      return filePath;
    }
  } catch (e) {
    // silent
  }
  return null;
}

// تبدیل field name به table name و بعد به file path
function fieldToTableName(fieldName) {
  let tableName = fieldName.substring(3); // حذف "tbl"
  if (tableName.endsWith("es")) {
    tableName = tableName.slice(0, -2);
  } else if (tableName.endsWith("s")) {
    tableName = tableName.slice(0, -1);
  }
  return "Tbl" + tableName;
}

// ساخت nested relation patterns
function buildNestedPatterns(
  fieldName,
  pkCamelCase,
  depth = 0,
  visited = new Set()
) {
  if (depth >= maxDepth || visited.has(fieldName)) {
    return [];
  }

  visited.add(fieldName);

  // اگر الان در کش هست
  if (!modelCache[fieldName]) {
    const tableName = fieldToTableName(fieldName);
    const modelFile = findModelFile(tableName);
    if (modelFile) {
      modelCache[fieldName] = extractRelationsFromFile(modelFile);
    } else {
      modelCache[fieldName] = [];
    }
  }

  const nestedRelations = modelCache[fieldName];
  const patterns = [];

  for (const nestedField of nestedRelations) {
    const nestedTableName = fieldToTableName(nestedField);
    const nestedPK = TablePKs[nestedTableName];
    if (!nestedPK) continue;

    const nestedPKCamelCase = _.camelCase(nestedPK);

    // Pattern برای connect nested
    patterns.push({
      fieldName,
      nestedField,
      pkCamelCase,
      nestedPKCamelCase,
    });

    // Recursive برای سطح بعدی
    const deeperPatterns = buildNestedPatterns(
      nestedField,
      nestedPKCamelCase,
      depth + 1,
      new Set(visited)
    );
    patterns.push(...deeperPatterns);
  }

  return patterns;
}

// استخراج relation fields از فایل
function extractRelationFields(content) {
  const matches = content.match(
    /(?:tbl[A-Za-z_]+):\s*(?:t\.(?:Array|Optional|Partial)\s*\()?\s*t\.Object\s*\(/g
  );
  if (!matches) return [];

  const fields = matches
    .map((m) => {
      const fieldMatch = m.match(/tbl[A-Za-z_]+/);
      return fieldMatch ? fieldMatch[0] : null;
    })
    .filter(Boolean);

  return [...new Set(fields)];
}

function fixFile(filePath, fieldToPKMap) {
  let content = fs.readFileSync(filePath, "utf-8");
  const original = content;

  const relationFields = extractRelationFields(content);

  if (relationFields.length === 0) {
    return;
  }

  // اول: اصلاح PK های سطح اول
  for (const fieldName of relationFields) {
    const pkCamelCase = fieldToPKMap[fieldName];

    if (!pkCamelCase) {
      console.warn(`⚠️  فیلد ${fieldName} در نقشه پیدا نشد`);
      continue;
    }

    const patterns = [
      {
        regex: new RegExp(
          `(${fieldName}\\s*:\\s*t\\.(?:Optional|Array|Partial)\\s*\\([^}]*?\\{\\s*connect\\s*:\\s*t\\.Array\\s*\\(\\s*t\\.Object\\s*\\(\\s*\\{\\s*)id(\\s*:)`,
          "g"
        ),
        replacement: `$1${pkCamelCase}$2`,
      },
      {
        regex: new RegExp(
          `(${fieldName}\\s*:\\s*t\\.(?:Optional|Array|Partial)\\s*\\([^}]*?\\{\\s*connect\\s*:\\s*t\\.Object\\s*\\(\\s*\\{\\s*)id(\\s*:)`,
          "g"
        ),
        replacement: `$1${pkCamelCase}$2`,
      },
      {
        regex: new RegExp(
          `(${fieldName}\\s*:[^}]*?disconnect\\s*:\\s*t\\.Array\\s*\\(\\s*t\\.Object\\s*\\(\\s*\\{\\s*)id(\\s*:)`,
          "g"
        ),
        replacement: `$1${pkCamelCase}$2`,
      },
      {
        regex: new RegExp(
          `(${fieldName}\\s*:[^}]*?disconnect\\s*:\\s*t\\.Object\\s*\\(\\s*\\{\\s*)id(\\s*:)`,
          "g"
        ),
        replacement: `$1${pkCamelCase}$2`,
      },
    ];

    for (const pattern of patterns) {
      content = content.replace(pattern.regex, pattern.replacement);
    }
  }

  // دوم: اصلاح nested relations (سطح‌های عمیق‌تر)
  for (const fieldName of relationFields) {
    const pkCamelCase = fieldToPKMap[fieldName];
    if (!pkCamelCase) continue;

    const nestedPatterns = buildNestedPatterns(fieldName, pkCamelCase);

    for (const nested of nestedPatterns) {
      // Pattern برای nested connect
      const nestedConnectRegex = new RegExp(
        `(${nested.fieldName}\\s*:[^}]*?\\{\\s*[^}]*?id\\s*:\\s*[^,}]+,\\s*${nested.nestedField}\\s*:\\s*\\{\\s*connect\\s*:\\s*t\\.(?:Array\\s*\\(\\s*)?t\\.Object\\s*\\(\\s*\\{\\s*)id(\\s*:)`,
        "g"
      );

      content = content.replace(
        nestedConnectRegex,
        `$1${nested.nestedPKCamelCase}$2`
      );
    }
  }

  if (content !== original) {
    fixedCount++;
    fs.writeFileSync(filePath, content, "utf-8");
    console.log(`✅ fixed: ${path.basename(filePath)}`);
  }
}

function walk(dir, fieldToPKMap) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const e of entries) {
    const full = path.join(dir, e.name);

    if (e.isDirectory()) {
      walk(full, fieldToPKMap);
      continue;
    }

    if (!e.name.endsWith(".ts")) continue;

    fixFile(full, fieldToPKMap);
  }
}

const fieldToPKMap = buildFieldToPKMap();
walk(prismaboxDir, fieldToPKMap);
console.log(`\n🎉 Done. Updated ${fixedCount} files.`);
