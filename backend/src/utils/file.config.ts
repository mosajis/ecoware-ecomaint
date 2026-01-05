import path from 'path'

// Configuration
export const FILE_CONFIG = {
  // Root directory for uploads
  UPLOAD_DIR: path.join(process.cwd(), 'uploads'),
  ATTACHMENT_DIR: path.join(process.cwd(), 'uploads', 'attachments'),

  // File size limit (30 MB)
  MAX_FILE_SIZE: 30 * 1024 * 1024,

  // Allowed MIME types
  ALLOWED_MIME_TYPES: {
    'application/pdf': '.pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
      '.docx',
    'application/msword': '.doc',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
      '.xlsx',
    'application/vnd.ms-excel': '.xls',
    'text/csv': '.csv',
    'text/plain': '.txt',
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/gif': '.gif',
    'image/webp': '.webp',
    'image/bmp': '.bmp',
  },

  // Extensions whitelist
  ALLOWED_EXTENSIONS: [
    '.pdf',
    '.docx',
    '.doc',
    '.txt',
    '.xlsx',
    '.xls',
    '.csv',
    '.txt',
    '.jpg',
    '.jpeg',
    '.png',
    '.gif',
    '.webp',
    '.bmp',
  ],
}

export type AllowedMimeType = keyof typeof FILE_CONFIG.ALLOWED_MIME_TYPES
