#!/usr/bin/env bun
import { $, color } from 'bun'

const SCHEMA = './orm/schema.prisma'

const commands = {
  generate: 'Generate Prisma Client',
  pull: 'Pull database schema',
  push: 'Push schema to database',
  format: 'Format schema file',
  studio: 'Open Prisma Studio',
  'fix-timestamps': 'Fix timestamps in schema',
  'fix-sequences': 'Fix sequences in schema',
  'fix-client-ids': 'Fix client IDs',
  'fix-client-datetimes': 'Fix client DateTimes',
}

/**
 * Log message with timestamp and type icon
 * @param {string} title - Title of the log
 * @param {string} message - Log message
 * @param {string} type - Type: info, success, error, warn
 */
async function log(title, message, type = 'info') {
  const timestamp = new Date().toLocaleTimeString('en-US')
  const icons = {
    info: 'ℹ️',
    success: '✅',
    error: '❌',
    warn: '⚠️',
  }

  console.log(
    `${icons[type]} [${color.gray(timestamp)}] ${color.bold(title)}: ${message}`
  )
}

/**
 * Execute a shell command with error handling
 * @param {string} cmd - Command to execute
 * @param {string} title - Title for logging
 */
async function runCommand(cmd, title) {
  try {
    await log(title, 'Starting...', 'info')
    await $`${cmd}`
    await log(title, 'Completed', 'success')
  } catch (error) {
    await log(title, `Error: ${error.message}`, 'error')
    process.exit(1)
  }
}

/**
 * Generate Prisma Client
 */
async function generate() {
  await runCommand(`prisma generate --schema=${SCHEMA}`, 'Generate Client')
  await fixClientIds()
}

/**
 * Pull database schema and apply all fixes
 */
async function pull() {
  await runCommand(`prisma db pull --schema=${SCHEMA} --force`, 'Pull Database')
  await fixTimestamps()
  await fixSequences()
  await format()
  await generate()
  await push()
}

/**
 * Push schema changes to database
 */
async function push() {
  await runCommand(`prisma db push --schema=${SCHEMA}`, 'Push to Database')
  await generate()
}

/**
 * Format and apply case formatting to schema
 */
async function format() {
  await runCommand(`prisma format --schema=${SCHEMA}`, 'Format Schema')
  await runCommand(
    `prisma-case-format --file ${SCHEMA} -p`,
    'Apply Case Format'
  )
}

/**
 * Open Prisma Studio
 */
async function studio() {
  await runCommand(`prisma studio --schema=${SCHEMA}`, 'Prisma Studio')
}

/**
 * Fix timestamps in schema
 */
async function fixTimestamps() {
  await runCommand(
    `bun run ./scripts/fix-schema-timestamps.js`,
    'Fix Timestamps'
  )
}

/**
 * Fix sequences in schema
 */
async function fixSequences() {
  await runCommand(`bun run ./scripts/fix-schema-sequences.js`, 'Fix Sequences')
}

/**
 * Fix client IDs
 */
async function fixClientIds() {
  await runCommand(`bun run ./scripts/fix-client-ids.js`, 'Fix Client IDs')
}

/**
 * Fix client DateTimes
 */
async function fixClientDateTimes() {
  await runCommand(
    `bun run ./scripts/fix-client-dateTimes.js`,
    'Fix Client DateTimes'
  )
}

/**
 * Display help menu with available commands
 */
async function showHelp() {
  console.log('\n' + color.bold('📋 Available Commands:\n'))
  Object.entries(commands).forEach(([cmd, desc]) => {
    console.log(`  ${color.cyan(cmd.padEnd(20))} - ${desc}`)
  })
  console.log(`\n${color.gray('Example: bun run scripts/prisma.js pull\n')}`)
}

/**
 * Main entry point
 */
async function main() {
  const command = process.argv[2]

  if (!command || command === 'help') {
    await showHelp()
    return
  }

  const commandMap = {
    generate,
    pull,
    push,
    format,
    studio,
    'fix-timestamps': fixTimestamps,
    'fix-sequences': fixSequences,
    'fix-client-ids': fixClientIds,
    'fix-client-datetimes': fixClientDateTimes,
  }

  if (commandMap[command]) {
    await commandMap[command]()
  } else {
    await log('Error', `Unknown command: ${command}`, 'error')
    await showHelp()
    process.exit(1)
  }
}

main()
