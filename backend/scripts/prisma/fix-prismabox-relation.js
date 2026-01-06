#!/usr/bin/env node
const fs = require('fs')
const path = require('path')
const _ = require('lodash')

// Mapping of table names to their primary keys
const TABLE_PKS = {
  TblAddress: 'AddressID',
  TblAttachment: 'AttachmentID',
  TblAttachmentType: 'AttachmentTypeID',
  TblComponentUnitAttachment: 'ComponentUnitAttachmentID',
  TblCompTypeAttachment: 'CompTypeAttachmentID',
  TblFailureReportAttachment: 'FailureReportAttachmentID',
  TblJobDescriptionAttachment: 'JobDescriptionAttachmentID',
  TblMaintLogAttachment: 'MaintLogAttachmentID',
  TblWorkShopRequestAttachment: 'WShopRequestAttachmentID',
  TblCompCounter: 'CompCounterID',
  TblCompCounterLog: 'CompCounterLogID',
  TblCompJob: 'CompJobID',
  TblCompJobCounter: 'CompJobCounterID',
  TblCompJobMeasurePoint: 'CompJobMeasurePointID',
  TblCompJobTrigger: 'CompJobTriggerID',
  TblCompMeasurePoint: 'CompMeasurePointID',
  TblCompMeasurePointLog: 'CompMeasurePointLogID',
  TblCompOilInfo: 'CompOilInfoID',
  TblComponentUnit: 'CompID',
  TblCompSpare: 'CompSpareID',
  TblCompStatus: 'CompStatusId',
  TblCompStatusLog: 'CompStatusLogID',
  TblCompType: 'CompTypeID',
  TblCompTypeCounter: 'CompTypeCounterID',
  TblCompTypeJob: 'CompTypeJobID',
  TblCompTypeJobCounter: 'CompTypeJobCounterID',
  TblCompTypeJobMeasurePoint: 'CompTypeJobMeasurePointID',
  TblCompTypeJobTrigger: 'CompTypeJobTriggerID',
  TblCompTypeMeasurePoint: 'CompTypeMeasurePointID',
  TblCounterType: 'CounterTypeID',
  TblDepartment: 'DeptID',
  TblDiscipline: 'DiscID',
  TblEmployee: 'EmployeeID',
  TblFailureReports: 'FailureReportId',
  TblFollowStatus: 'FollowStatusID',
  TblFunctions: 'FunctionID',
  TblJobClass: 'JobClassID',
  TblJobDescription: 'JobDescID',
  TblJobTrigger: 'JobTriggerID',
  TblJobTrigger_Log: 'JobTriggerLogID',
  TblJobVersion: 'JobVersionID',
  TblLocation: 'LocationID',
  TblLogCounter: 'LogCounterID',
  TblLogDiscipline: 'LogDiscID',
  TblLoginAudit: 'LoginAuditID',
  TblMaintCause: 'MaintCauseID',
  TblMaintClass: 'MaintClassID',
  TblMaintLog: 'MaintLogID',
  TblMaintLogStocks: 'MaintLogStockID',
  TblMaintLogFollow: 'FollowID',
  TblMaintType: 'MaintTypeID',
  TblOilSamplingLog: 'OilSamplingLogID',
  TblPendingType: 'PendTypeId',
  TblReScheduleLog: 'RescheduleLogID',
  TblRotationLog: 'RotationLogID',
  TblPeriod: 'PeriodID',
  TblRound: 'RoundID',
  TblRoundCompJob: 'RoundCompJobID',
  TblStockType: 'StockTypeID',
  TblStockItem: 'StockItemID',
  TblUnit: 'UnitID',
  TblWorkOrder: 'WorkOrderID',
  TblWorkOrderStatus: 'WorkOrderStatusId',
  TblWorkShopComponent: 'WShopCompID',
  TblWorkShopDone: 'WShopDoneID',
  TblWorkShopRequest: 'WShopRequestID',
  TblUsers: 'UserID',
}

const PRISMABOX_DIR = path.resolve('./orm/generated/prismabox')
const MAX_DEPTH = 5

let fixedCount = 0
const modelCache = {}

/**
 * Log utility with timestamps
 */
function log(message, type = 'info') {
  const timestamp = new Date().toLocaleTimeString('en-US')
  const icons = {
    info: 'ℹ️',
    success: '✅',
    warn: '⚠️',
    error: '❌',
  }

  console.log(`${icons[type]} [${timestamp}] ${message}`)
}

/**
 * Build reverse mapping from field names to primary keys
 */
function buildFieldToPKMap() {
  const map = {}

  for (const [tableName, pk] of Object.entries(TABLE_PKS)) {
    const fieldNameBase = tableName.charAt(0).toLowerCase() + tableName.slice(1)
    map[fieldNameBase] = _.camelCase(pk)

    if (!fieldNameBase.endsWith('s')) {
      map[fieldNameBase + 's'] = _.camelCase(pk)
    }
  }

  return map
}

/**
 * Extract relation fields from a file
 */
function extractRelationFields(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8')
    const matches = content.match(
      /(?:tbl[A-Za-z_]+):\s*(?:t\.(?:Array|Optional|Partial)\s*\()?\s*t\.Object\s*\(/g
    )

    if (!matches) return []

    const fields = matches
      .map(m => {
        const fieldMatch = m.match(/tbl[A-Za-z_]+/)
        return fieldMatch ? fieldMatch[0] : null
      })
      .filter(Boolean)

    return [...new Set(fields)]
  } catch (error) {
    return []
  }
}

/**
 * Find model file by table name
 */
function findModelFile(tableName) {
  try {
    const filePath = path.join(PRISMABOX_DIR, `${tableName}.ts`)
    return fs.existsSync(filePath) ? filePath : null
  } catch (error) {
    return null
  }
}

/**
 * Convert field name (tblXxx) to table name (TblXxx)
 */
function fieldToTableName(fieldName) {
  let tableName = fieldName.substring(3)

  if (tableName.endsWith('es')) {
    tableName = tableName.slice(0, -2)
  } else if (tableName.endsWith('s')) {
    tableName = tableName.slice(0, -1)
  }

  return 'Tbl' + tableName
}

/**
 * Build nested relation patterns for deep relations
 */
function buildNestedPatterns(
  fieldName,
  pkCamelCase,
  depth = 0,
  visited = new Set()
) {
  if (depth >= MAX_DEPTH || visited.has(fieldName)) {
    return []
  }

  visited.add(fieldName)

  if (!modelCache[fieldName]) {
    const tableName = fieldToTableName(fieldName)
    const modelFile = findModelFile(tableName)

    modelCache[fieldName] = modelFile ? extractRelationFields(modelFile) : []
  }

  const nestedRelations = modelCache[fieldName]
  const patterns = []

  for (const nestedField of nestedRelations) {
    const nestedTableName = fieldToTableName(nestedField)
    const nestedPK = TABLE_PKS[nestedTableName]

    if (!nestedPK) continue

    const nestedPKCamelCase = _.camelCase(nestedPK)

    patterns.push({
      fieldName,
      nestedField,
      pkCamelCase,
      nestedPKCamelCase,
    })

    const deeperPatterns = buildNestedPatterns(
      nestedField,
      nestedPKCamelCase,
      depth + 1,
      new Set(visited)
    )

    patterns.push(...deeperPatterns)
  }

  return patterns
}

/**
 * Fix client IDs in a file
 */
function fixFile(filePath, fieldToPKMap) {
  let content = fs.readFileSync(filePath, 'utf-8')
  const original = content

  const relationFields = extractRelationFields(filePath)

  if (relationFields.length === 0) {
    return
  }

  // Fix first-level PK references
  for (const fieldName of relationFields) {
    const pkCamelCase = fieldToPKMap[fieldName]

    if (!pkCamelCase) {
      log(`Cannot find PK mapping for: ${fieldName}`, 'warn')
      continue
    }

    const patterns = [
      {
        regex: new RegExp(
          `(${fieldName}\\s*:\\s*t\\.(?:Optional|Array|Partial)\\s*\\([^}]*?\\{\\s*connect\\s*:\\s*t\\.Array\\s*\\(\\s*t\\.Object\\s*\\(\\s*\\{\\s*)id(\\s*:)`,
          'g'
        ),
        replacement: `$1${pkCamelCase}$2`,
      },
      {
        regex: new RegExp(
          `(${fieldName}\\s*:\\s*t\\.(?:Optional|Array|Partial)\\s*\\([^}]*?\\{\\s*connect\\s*:\\s*t\\.Object\\s*\\(\\s*\\{\\s*)id(\\s*:)`,
          'g'
        ),
        replacement: `$1${pkCamelCase}$2`,
      },
      {
        regex: new RegExp(
          `(${fieldName}\\s*:[^}]*?disconnect\\s*:\\s*t\\.Array\\s*\\(\\s*t\\.Object\\s*\\(\\s*\\{\\s*)id(\\s*:)`,
          'g'
        ),
        replacement: `$1${pkCamelCase}$2`,
      },
      {
        regex: new RegExp(
          `(${fieldName}\\s*:[^}]*?disconnect\\s*:\\s*t\\.Object\\s*\\(\\s*\\{\\s*)id(\\s*:)`,
          'g'
        ),
        replacement: `$1${pkCamelCase}$2`,
      },
      // NEW: Fix for RelationsInputCreate and RelationsInputUpdate
      {
        regex: new RegExp(
          `(${fieldName}\\s*:\\s*t\\.Object\\s*\\(\\s*\\{\\s*connect\\s*:\\s*t\\.Object\\s*\\(\\s*\\{\\s*)id(\\s*:)`,
          'g'
        ),
        replacement: `$1${pkCamelCase}$2`,
      },
    ]

    for (const pattern of patterns) {
      content = content.replace(pattern.regex, pattern.replacement)
    }
  }

  // Fix nested relation references
  for (const fieldName of relationFields) {
    const pkCamelCase = fieldToPKMap[fieldName]
    if (!pkCamelCase) continue

    const nestedPatterns = buildNestedPatterns(fieldName, pkCamelCase)

    for (const nested of nestedPatterns) {
      const nestedConnectRegex = new RegExp(
        `(${nested.fieldName}\\s*:[^}]*?\\{\\s*[^}]*?id\\s*:\\s*[^,}]+,\\s*${nested.nestedField}\\s*:\\s*\\{\\s*connect\\s*:\\s*t\\.(?:Array\\s*\\(\\s*)?t\\.Object\\s*\\(\\s*\\{\\s*)id(\\s*:)`,
        'g'
      )

      content = content.replace(
        nestedConnectRegex,
        `$1${nested.nestedPKCamelCase}$2`
      )
    }
  }

  if (content !== original) {
    fixedCount++
    fs.writeFileSync(filePath, content, 'utf-8')
    log(`Fixed: ${path.basename(filePath)}`, 'success')
  }
}

/**
 * Recursively walk directory and fix all TypeScript files
 */
function walkDirectory(dir, fieldToPKMap) {
  const entries = fs.readdirSync(dir, { withFileTypes: true })

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)

    if (entry.isDirectory()) {
      walkDirectory(fullPath, fieldToPKMap)
      continue
    }

    if (entry.name.endsWith('.ts')) {
      fixFile(fullPath, fieldToPKMap)
    }
  }
}

/**
 * Main function
 */
function main() {
  try {
    log('Starting client ID fixer...', 'info')

    if (!fs.existsSync(PRISMABOX_DIR)) {
      log(`Error: Directory not found: ${PRISMABOX_DIR}`, 'error')
      process.exit(1)
    }

    const fieldToPKMap = buildFieldToPKMap()
    walkDirectory(PRISMABOX_DIR, fieldToPKMap)

    log(`Completed! Fixed ${fixedCount} files.`, 'success')
  } catch (error) {
    log(`Error: ${error.message}`, 'error')
    process.exit(1)
  }
}

main()
