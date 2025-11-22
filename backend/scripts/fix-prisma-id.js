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

// مسیر فولدر خروجی PrismaBox
const prismaboxDir = path.resolve("./orm/generated/prismabox");

let fixedCount = 0;

// ساخت Regex برای اصلاح id:
function buildRegexFor(pk) {
  return {
    connectSingle: /connect\s*:\s*t\.Object\s*\(\s*\{\s*id\s*:/g,
    connectMany: /connect\s*:\s*t\.Array\s*\(\s*t\.Object\s*\(\s*\{\s*id\s*:/g,
    disconnectSingle: /disconnect\s*:\s*t\.Object\s*\(\s*\{\s*id\s*:/g,
    disconnectMany:
      /disconnect\s*:\s*t\.Array\s*\(\s*t\.Object\s*\(\s*\{\s*id\s*:/g,
  };
}

// اصلاح یک فایل
function fixFile(filePath, pk) {
  let content = fs.readFileSync(filePath, "utf-8");
  const original = content;

  const p = buildRegexFor(pk);

  content = content.replace(p.connectSingle, `connect: t.Object({ ${pk}:`);
  content = content.replace(
    p.connectMany,
    `connect: t.Array(t.Object({ ${pk}:`
  );
  content = content.replace(
    p.disconnectSingle,
    `disconnect: t.Object({ ${pk}:`
  );
  content = content.replace(
    p.disconnectMany,
    `disconnect: t.Array(t.Object({ ${pk}:`
  );

  if (content !== original) {
    fixedCount++;
    fs.writeFileSync(filePath, content, "utf-8");
  } else {
    console.log("x fixed:", filePath);
  }
}

// پیمایش تمام فایل‌ها
function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const e of entries) {
    const full = path.join(dir, e.name);

    if (e.isDirectory()) {
      walk(full);
      continue;
    }

    if (!e.name.endsWith(".ts")) continue;

    const fileContent = fs.readFileSync(full, "utf-8");

    // فقط وقتی جدول موجود باشد
    for (const [tableName, pk] of Object.entries(TablePKs)) {
      if (fileContent.includes(tableName)) {
        fixFile(full, _.camelCase(pk));
        break;
      }
    }
  }
}

console.log("⏳ Fixing PrismaBox files...");
walk(prismaboxDir);
console.log(`🎉 Done. Updated ${fixedCount} files.`);
