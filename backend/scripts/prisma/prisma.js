#!/usr/bin/env node
const { execSync } = require('child_process')
const chalk = require('chalk')

const SCHEMA = './orm/schema.prisma'

const commands = {
  generate: 'Generate Prisma Client',
  pull: 'Pull database schema',
  push: 'Push schema to database',
  format: 'Format schema file',
  studio: 'Open Prisma Studio',
  'fix-timestamps': 'Fix timestamp fields in schema',
  'fix-relations': 'Fix relation fields in generated files',
  'fix-datetimes': 'Fix DateTime types in generated files',
}

/**
 * Log message with timestamp and type icon
 * @param {string} title - Title of the log
 * @param {string} message - Log message
 * @param {string} type - Type: info, success, error, warn
 */
function log(title, message, type = 'info') {
  const timestamp = new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
  const icons = {
    info: 'ℹ️ ',
    success: '✅',
    error: '❌',
    warn: '⚠️',
  }

  const colors = {
    info: chalk.blue,
    success: chalk.green,
    error: chalk.red,
    warn: chalk.yellow,
  }

  const colorFn = colors[type] || chalk.gray
  const time = chalk.gray(`[${timestamp}]`)
  const titleText = chalk.bold(title)
  const messageText = colorFn(message)

  console.log(`${icons[type]} ${time} ${titleText}: ${messageText}`)
}

/**
 * Execute a shell command with error handling
 * @param {string} cmd - Command to execute
 * @param {string} title - Title for logging
 */
function runCommand(cmd, title) {
  try {
    log(title, 'Starting', 'info')
    execSync(cmd, { stdio: 'pipe' })
    log(title, 'Done', 'success')
  } catch (error) {
    log(title, `Failed - ${error.message}`, 'error')
    process.exit(1)
  }
}

/**
 * Generate Prisma Client
 */
function generate() {
  runCommand(`prisma generate --schema=${SCHEMA}`, 'Generate Client')
  fixRelations()
}

/**
 * Pull database schema and apply all fixes
 */
function pull() {
  runCommand(`prisma db pull --schema=${SCHEMA} --force`, 'Pull Database')
  fixTimestamps()
  format()
  generate()
  // log('Prisma', 'Pushing changes to database...', 'info')
  // push()
  // log('Prisma', 'Pull completed successfully!', 'success')
}

/**
 * Push schema changes to database
 */
function push() {
  runCommand(`prisma db push --schema=${SCHEMA}`, 'Push Database')
}

/**
 * Format and apply case formatting to schema
 */
function format() {
  runCommand(`prisma format --schema=${SCHEMA}`, 'Format Schema')
  runCommand(`prisma-case-format --file ${SCHEMA} -p`, 'Case Format')
}

/**
 * Open Prisma Studio
 */
function studio() {
  runCommand(`prisma studio --schema=${SCHEMA}`, 'Prisma Studio')
}

/**
 * Fix timestamps in schema
 */
function fixTimestamps() {
  runCommand(`node ./scripts/prisma/fix-timestamp-schema.js`, 'Fix Timestamps')
}

/**
 * Fix relation fields in generated files
 */
function fixRelations() {
  runCommand(`node ./scripts/prisma/fix-prismabox-relation.js`, 'Fix Relations')
}

/**
 * Fix DateTime types in generated files
 */
function fixDateTimes() {
  runCommand(
    `node ./scripts/prisma/fix-prismabox-dateTimes.js`,
    'Fix DateTime Types'
  )
}

/**
 * Display help menu with available commands
 */
function showHelp() {
  console.log('\n' + chalk.bold.cyan('📋 Available Commands:\n'))
  Object.entries(commands).forEach(([cmd, desc]) => {
    const cmdText = chalk.cyan(cmd.padEnd(20))
    const descText = chalk.gray(desc)
    console.log(`  ${cmdText} ${descText}`)
  })
  console.log(
    `\n${chalk.gray('Examples:')}\n  node scripts/prisma/prisma.js pull\n  node scripts/prisma/prisma.js generate\n`
  )
}

/**
 * Main entry point
 */
function main() {
  const command = process.argv[2]

  if (!command || command === 'help') {
    showHelp()
    return
  }

  const commandMap = {
    generate,
    pull,
    push,
    format,
    studio,
    'fix-timestamps': fixTimestamps,
    'fix-relations': fixRelations,
    'fix-datetimes': fixDateTimes,
  }

  if (commandMap[command]) {
    commandMap[command]()
  } else {
    log('Error', `Unknown command: "${command}"`, 'error')
    showHelp()
    process.exit(1)
  }
}

main()
