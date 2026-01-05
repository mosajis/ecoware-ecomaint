import { promises as fs } from 'fs'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'
import { FILE_CONFIG, type AllowedMimeType } from './file.config'

export interface UploadedFileInfo {
  originalName: string
  storageName: string // UUID based name
  mimeType: string
  size: number
  extension: string
  storagePath: string // Relative path for database
}

export interface FileValidationError {
  code: string
  message: string
}

export class FileService {
  /**
   * Validate file before upload
   */
  static validateFile(
    originalName: string,
    mimeType: string,
    size: number
  ): FileValidationError | null {
    // Check file size
    if (size > FILE_CONFIG.MAX_FILE_SIZE) {
      return {
        code: 'FILE_TOO_LARGE',
        message: `File exceeds maximum size of ${30}MB`,
      }
    }

    // Check MIME type
    if (!FILE_CONFIG.ALLOWED_MIME_TYPES[mimeType as AllowedMimeType]) {
      return {
        code: 'INVALID_MIME_TYPE',
        message: 'File type is not allowed',
      }
    }

    // Check extension
    const ext = path.extname(originalName).toLowerCase()
    if (!FILE_CONFIG.ALLOWED_EXTENSIONS.includes(ext)) {
      return {
        code: 'INVALID_EXTENSION',
        message: 'File extension is not allowed',
      }
    }

    return null
  }

  /**
   * Ensure upload directory exists
   */
  static async ensureUploadDir(): Promise<void> {
    try {
      await fs.mkdir(FILE_CONFIG.ATTACHMENT_DIR, { recursive: true })
    } catch (error) {
      throw new Error(`Failed to create upload directory: ${error}`)
    }
  }

  /**
   * Save file buffer to disk
   */
  static async saveFile(
    buffer: Buffer,
    originalName: string,
    mimeType: string
  ): Promise<UploadedFileInfo> {
    // Validate before saving
    const validationError = this.validateFile(
      originalName,
      mimeType,
      buffer.length
    )
    if (validationError) {
      throw new Error(validationError.message)
    }

    // Ensure directory exists
    await this.ensureUploadDir()

    // Generate UUID-based filename
    const uuid = uuidv4()
    const extension = path.extname(originalName).toLowerCase()
    const storageName = `${uuid}${extension}`
    const storagePath = path.join(FILE_CONFIG.ATTACHMENT_DIR, storageName)

    // Relative path for database storage
    const relativePath = path.relative(FILE_CONFIG.UPLOAD_DIR, storagePath)

    try {
      await fs.writeFile(storagePath, buffer)

      return {
        originalName,
        storageName,
        mimeType,
        size: buffer.length,
        extension,
        storagePath: relativePath, // Store relative path in DB
      }
    } catch (error) {
      throw new Error(`Failed to save file: ${error}`)
    }
  }

  /**
   * Read file for download
   */
  static async readFile(storagePath: string): Promise<Buffer> {
    const fullPath = path.join(FILE_CONFIG.UPLOAD_DIR, storagePath)

    try {
      return await fs.readFile(fullPath)
    } catch (error) {
      throw new Error(`File not found: ${error}`)
    }
  }

  /**
   * Delete file from disk
   */
  static async deleteFile(storagePath: string): Promise<void> {
    const fullPath = path.join(FILE_CONFIG.UPLOAD_DIR, storagePath)

    try {
      await fs.unlink(fullPath)
    } catch (error) {
      // Log error but don't throw - file might already be deleted
      console.warn(`Failed to delete file: ${error}`)
    }
  }

  /**
   * Get file info for download response
   */
  static getDownloadHeaders(originalName: string, mimeType: string) {
    const encodedName = encodeURIComponent(originalName)

    return {
      'Content-Type': mimeType,
      'Content-Disposition': `attachment; filename*=UTF-8''${encodedName}`,
    }
  }
}
