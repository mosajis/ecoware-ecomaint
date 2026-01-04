#!/usr/bin/env bun
import fs from 'fs'
import path from 'path'

const schemaPath = path.resolve('./orm/schema.prisma')

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
 * Fix timestamp fields in Prisma schema
 * Ensures createdAt and updatedAt fields have proper decorators
 */
function main() {
  try {
    log('Reading schema from: ' + schemaPath)

    // Read schema file
    if (!fs.existsSync(schemaPath)) {
      log(`Schema file not found: ${schemaPath}`, 'error')
      process.exit(1)
    }

    let schema = fs.readFileSync(schemaPath, 'utf-8')
    const originalSchema = schema // Keep backup for comparison

    // Fix createdAt fields - add @default(now()) and @map decorators
    schema = schema.replace(
      /(\s+)createdAt\s+DateTime(?!.*@default\(now\(\))/gm,
      `$1createdAt   DateTime @default(now()) @map("created_at")`
    )

    // Fix updatedAt fields - add @updatedAt decorator
    schema = schema.replace(
      /(\s+)updatedAt\s+DateTime(?!.*@updatedAt)/gm,
      `$1updatedAt   DateTime @updatedAt @map("updated_at")`
    )

    // Validate schema changed
    if (schema === originalSchema) {
      log('No timestamp fields needed fixing', 'warn')
      return
    }

    // Write updated schema
    fs.writeFileSync(schemaPath, schema, 'utf-8')
    log('Timestamp fields fixed successfully', 'success')
  } catch (error) {
    log(`Error fixing timestamps: ${error.message}`, 'error')
    process.exit(1)
  }
}

main()
