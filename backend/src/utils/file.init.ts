import { promises as fs } from 'fs'
import { FILE_CONFIG } from './file.config'

/**
 * Initialize upload directories on app startup
 * Call this in your main.ts or server initialization
 */
export async function initializeUploadDirs() {
  try {
    // Create main uploads directory
    await fs.mkdir(FILE_CONFIG.UPLOAD_DIR, { recursive: true })

    // Create attachments subdirectory
    await fs.mkdir(FILE_CONFIG.ATTACHMENT_DIR, { recursive: true })

    // Optional: Create .gitkeep files to track empty directories in git
    const gitkeepPath = `${FILE_CONFIG.ATTACHMENT_DIR}/.gitkeep`
    try {
      await fs.writeFile(gitkeepPath, '')
    } catch {
      // File might already exist
    }
  } catch (error) {
    console.error('❌ Failed to initialize upload directories:', error)
    throw error
  }
}

/**
 * Cleanup function (optional - for development/testing)
 */
export async function cleanupUploadDirs() {
  try {
    await fs.rm(FILE_CONFIG.UPLOAD_DIR, { recursive: true, force: true })
    console.log('✅ Upload directories cleaned up')
  } catch (error) {
    console.error('❌ Failed to cleanup upload directories:', error)
  }
}
