const fs = require('fs')
const path = require('path')

// Read prisma schema and extract DateTime fields
function extractDateTimeFields(schemaPath) {
  try {
    const content = fs.readFileSync(schemaPath, 'utf-8')
    const dateTimeFields = new Set()

    // Find all DateTime fields in models
    const dateTimeMatches = content.matchAll(/(\w+)\s+DateTime/g)

    for (const match of dateTimeMatches) {
      dateTimeFields.add(match[1])
    }

    return Array.from(dateTimeFields)
  } catch (e) {
    console.error('❌ Error reading prisma schema:', e.message)
    return []
  }
}

// Fix generated files to convert t.Date() to t.String() for DateTime fields
function fixDateTimeInGeneratedFiles(generatedDir, dateTimeFields) {
  let fixedCount = 0

  console.log(`📋 Found DateTime fields: ${dateTimeFields.join(', ')}\n`)

  function walkDir(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true })

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name)

      if (entry.isDirectory()) {
        walkDir(fullPath)
        continue
      }

      if (!entry.name.endsWith('.ts')) continue

      let content = fs.readFileSync(fullPath, 'utf-8')
      const original = content
      let hasChanges = false

      // For each DateTime field, replace t.Date() with t.String()
      for (const field of dateTimeFields) {
        // Pattern 1: fieldName: t.Date()
        const pattern1 = new RegExp(`(\\b${field}\\s*:\\s*)t\\.Date\\(\\)`, 'g')
        if (pattern1.test(content)) {
          content = content.replace(pattern1, `$1t.String()`)
          hasChanges = true
        }

        // Pattern 2: fieldName: __nullable__(t.Date())
        const pattern2 = new RegExp(
          `(\\b${field}\\s*:\\s*)__nullable__\\(t\\.Date\\(\\)\\)`,
          'g'
        )
        if (pattern2.test(content)) {
          content = content.replace(pattern2, `$1__nullable__(t.String())`)
          hasChanges = true
        }

        // Pattern 3: fieldName: t.Optional(__nullable__(t.Date()))
        const pattern3 = new RegExp(
          `(\\b${field}\\s*:\\s*)t\\.Optional\\(__nullable__\\(t\\.Date\\(\\)\\)\\)`,
          'g'
        )
        if (pattern3.test(content)) {
          content = content.replace(
            pattern3,
            `$1t.Optional(__nullable__(t.String()))`
          )
          hasChanges = true
        }

        // Pattern 4: fieldName: t.Optional(t.Date())
        const pattern4 = new RegExp(
          `(\\b${field}\\s*:\\s*)t\\.Optional\\(t\\.Date\\(\\)\\)`,
          'g'
        )
        if (pattern4.test(content)) {
          content = content.replace(pattern4, `$1t.Optional(t.String())`)
          hasChanges = true
        }
      }

      if (hasChanges && content !== original) {
        fixedCount++
        fs.writeFileSync(fullPath, content, 'utf-8')
        console.log(`✅ Fixed: ${path.basename(fullPath)}`)
      }
    }
  }

  walkDir(generatedDir)
  return fixedCount
}

// Run
const prismaSchemaPath = path.resolve('./orm/schema.prisma')
const generatedDir = path.resolve('./orm/generated/prismabox')

console.log('🔍 Checking DateTime fields in schema...\n')

const dateTimeFields = extractDateTimeFields(prismaSchemaPath)

if (dateTimeFields.length === 0) {
  console.log('⚠️  No DateTime fields found')
  process.exit(1)
}

if (!fs.existsSync(generatedDir)) {
  console.error(`❌ Directory not found: ${generatedDir}`)
  process.exit(1)
}

console.log('🔧 Fixing generated files...\n')

const fixedCount = fixDateTimeInGeneratedFiles(generatedDir, dateTimeFields)

console.log(`\n🎉 Done. Fixed ${fixedCount} files.`)
