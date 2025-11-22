const fs = require("fs");
const path = require("path");

const TablePKs = {
  tblAddress: "AddressID",
  tblCompCounter: "CompCounterID",
  tblCompCounterLog: "CompCounterLogID",
  tblCompJob: "CompJobID",
  tblCompJobCounter: "CompJobCounterID",
  tblCompJobMeasurePoint: "CompJobMeasurePointID",
  tblCompJobTrigger: "CompJobTriggerID",
  tblCompMeasurePoint: "CompMeasurePointID",
  tblCompMeasurePointLog: "CompMeasurePointLogID",
  TblCompOilInfo: "CompOilInfoID",
  tblComponentUnit: "CompID",
  tblCompSpare: "CompSpareID",
  tblCompStatus: "CompStatusId",
  tblCompStatusLog: "CompStatusLogID",
  tblCompType: "CompTypeID",
  tblCompTypeCounter: "CompTypeCounterID",
  tblCompTypeJob: "CompTypeJobID",
  tblCompTypeJobCounter: "CompTypeJobCounterID",
  tblCompTypeJobMeasurePoint: "CompTypeJobMeasurePointID",
  tblCompTypeJobTrigger: "CompTypeJobTriggerID",
  tblCompTypeMeasurePoint: "CompTypeMeasurePointID",
  tblCounterType: "CounterTypeID",
  tblDepartment: "DeptID",
  tblDiscipline: "DiscID",
  tblEmployee: "EmployeeID",
  tblFailureReports: "FailureReportId",
  tblFollowStatus: "FollowStatusID",
  tblFunctions: "FunctionID",
  tblJobClass: "JobClassID",
  tblJobDescription: "JobDescID",
  tblJobTrigger: "JobTriggerID",
  tblJobTrigger_Log: "JobTriggerLogID",
  tblJobVersion: "JobVersionID",
  tblLocation: "LocationID",
  tblLogCounter: "LogCounterID",
  tblLogDiscipline: "LogDiscID",
  tblLoginAudit: "LoginAuditID",
  tblMaintCause: "MaintCauseID",
  tblMaintClass: "MaintClassID",
  tblMaintLog: "MaintLogID",
  tblMaintLog_Stocks: "MaintLogStockId",
  tblMaintLogFollow: "FollowID",
  tblMaintType: "MaintTypeID",
  TblOilSamplingLog: "OilSamplingLogID",
  tblPendingType: "PendTypeId",
  tblReScheduleLog: "RescheduleLogID",
  tblRotationLog: "RotationLogID",
  tblRound: "RoundID",
  tblRoundCompJob: "RoundCompJobID",
  tblSpareType: "PartTypeID",
  tblSpareUnit: "PartID",
  tblUnit: "UnitID",
  tblWorkOrder: "WorkOrderID",
  tblWorkShopComponent: "WShopCompID",
  tblWorkShopDone: "WShopDoneID",
  tblWorkShopRequest: "WShopRequestID",
  Users: "UserID",
};

// مسیر فولدر تولیدی PrismaBox
const prismaboxDir = path.resolve("./orm/generated/prismabox");

let fixedCount = 0;

// --- ریجکس اصلی برای شناسایی "id" مستقل در connect و disconnect ---
function buildRegexFor(pk) {
  return {
    connectSingle: new RegExp(
      `connect\\s*:\\s*t\\.Object\\s*\\(\\s*\\{\\s*id(?=\\s*:)`,
      "g"
    ),
    connectMany: new RegExp(
      `connect\\s*:\\s*t\\.Array\\s*\\(\\s*t\\.Object\\s*\\(\\s*\\{\\s*id(?=\\s*:)`,
      "g"
    ),
    disconnectSingle: new RegExp(
      `disconnect\\s*:\\s*t\\.Object\\s*\\(\\s*\\{\\s*id(?=\\s*:)`,
      "g"
    ),
    disconnectMany: new RegExp(
      `disconnect\\s*:\\s*t\\.Array\\s*\\(\\s*t\\.Object\\s*\\(\\s*\\{\\s*id(?=\\s*:)`,
      "g"
    ),
  };
}

// پردازش هر فایل
function fixFile(filePath, pk) {
  let content = fs.readFileSync(filePath, "utf-8");
  const original = content;

  const patterns = buildRegexFor(pk);

  content = content.replace(
    patterns.connectSingle,
    `connect: t.Object({ ${pk}`
  );
  content = content.replace(
    patterns.connectMany,
    `connect: t.Array(t.Object({ ${pk}`
  );
  content = content.replace(
    patterns.disconnectSingle,
    `disconnect: t.Object({ ${pk}`
  );
  content = content.replace(
    patterns.disconnectMany,
    `disconnect: t.Array(t.Object({ ${pk}`
  );

  if (content !== original) {
    fixedCount++;
    fs.writeFileSync(filePath, content, "utf-8");
    console.log("✓ fixed:", filePath);
  }
}

// پیمایش مسیر
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

    for (const [tableName, pk] of Object.entries(TablePKs)) {
      if (fileContent.includes(tableName)) {
        fixFile(full, pk);
      } else {
        console.log("not found: " + tableName);
      }
    }
  }
}

console.log("⏳ Fixing PrismaBox files...");
walk(prismaboxDir);
console.log(`🎉 Done. Updated ${fixedCount} files.`);
