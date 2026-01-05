import { Elysia, t } from 'elysia'
import { BaseController } from '@/utils/base.controller'
import { BaseService } from '@/utils/base.service'
import { FileService } from '@/utils/file.service'
import {
  TblAttachment,
  TblAttachmentInputCreate,
  TblAttachmentInputUpdate,
  TblAttachmentPlain,
} from 'orm/generated/prismabox/TblAttachment'
import { buildResponseSchema } from '@/utils/base.schema'
import { prisma } from '@/utils/prisma'

// ========================================
// Interfaces
// ========================================
export interface CreateAttachmentInput {
  title?: string
  attachmentTypeId?: number
  isUserAttachment: boolean
  createdUserId: number
  buffer: Buffer
  originalFileName: string
  mimeType: string
}

export interface UpdateAttachmentInput {
  title?: string
  attachmentTypeId?: number
}

// ========================================
// Service
// ========================================
export class AttachmentService extends BaseService<any> {
  /**
   * Create attachment with file upload
   */
  async createWithFile(data: CreateAttachmentInput): Promise<any> {
    const fileInfo = await FileService.saveFile(
      data.buffer,
      data.originalFileName,
      data.mimeType
    )

    return this.create({
      title: data.title || fileInfo.originalName,
      fileName: fileInfo.originalName,
      path: fileInfo.storagePath,
      size: fileInfo.size,
      isUserAttachment: data.isUserAttachment,
      attachmentTypeId: data.attachmentTypeId,
      createdUserId: 16,
    } as any)
  }

  /**
   * Delete attachment (soft or force delete + file)
   */
  async deleteWithFile(
    where: Record<string, any>,
    options?: { force?: boolean }
  ): Promise<any> {
    const attachment = await this.findOne(where)

    if (!attachment) {
      throw new Error('Attachment not found')
    }

    if (attachment.path) {
      await FileService.deleteFile(attachment.path)
    }

    return this.delete(where, options)
  }

  /**
   * Delete multiple attachments
   */
  async deleteAllWithFiles(
    where?: Record<string, any>,
    options?: { force?: boolean }
  ): Promise<{ count: number }> {
    const attachments = await this.findAll({
      where,
      page: 1,
      perPage: Number.MAX_SAFE_INTEGER,
    })

    for (const attachment of attachments.items) {
      if (attachment.path) {
        await FileService.deleteFile(attachment.path)
      }
    }

    return this.deleteAll(where, options)
  }

  /**
   * Get file for download
   */
  async getFileForDownload(attachmentId: number): Promise<{
    buffer: Buffer
    originalName: string
    mimeType: string
  }> {
    const attachment = await this.findOne({ attachmentId })

    if (!attachment || !attachment.path) {
      throw new Error('Attachment not found')
    }

    const buffer = await FileService.readFile(attachment.path)

    return {
      buffer,
      originalName: attachment.fileName,
      mimeType: this.getMimeType(attachment.fileName),
    }
  }

  /**
   * Get MIME type from filename
   */
  private getMimeType(filename: string): string {
    const ext = filename.toLowerCase().split('.').pop()

    const mimeMap: Record<string, string> = {
      pdf: 'application/pdf',
      doc: 'application/msword',
      docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      xls: 'application/vnd.ms-excel',
      xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      csv: 'text/csv',
      txt: 'text/plain',
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      png: 'image/png',
      gif: 'image/gif',
      webp: 'image/webp',
      bmp: 'image/bmp',
    }

    return mimeMap[ext || ''] || 'application/octet-stream'
  }
}

// ========================================
// Initialize Service
// ========================================
export const ServiceTblAttachment = new AttachmentService(prisma.tblAttachment)

// ========================================
// Create Controller with Base Routes
// ========================================
const baseController = new BaseController({
  prefix: '/tblAttachment',
  swagger: {
    tags: ['tblAttachment'],
  },
  primaryKey: 'attachmentId',
  service: ServiceTblAttachment,
  createSchema: TblAttachmentInputCreate,
  updateSchema: TblAttachmentInputUpdate,
  responseSchema: buildResponseSchema(TblAttachmentPlain, TblAttachment),
  excludeRoutes: ['create'],
  extend: (app: Elysia) => {
    // POST / - Upload file
    app.post(
      '/',
      async ({ body, set }) => {
        try {
          // file واقعی از body.file یا body['file'] می‌آید به شرطی که parser درست باشد
          const file = body.file

          if (!file) {
            set.status = 400
            return { error: 'No file provided' }
          }

          // Elysia File Object: file is { filename, type, data: Uint8Array }
          const buffer = Buffer.from(await file.text())
          const fileName = file.name || 'unknown'
          const mimeType = file.type || 'application/octet-stream'

          // validation
          const validationError = FileService.validateFile(
            fileName,
            mimeType,
            buffer.length
          )
          if (validationError) {
            set.status = 400
            return {
              error: validationError.message,
              code: validationError.code,
            }
          }

          // // فیلدهای دیگر
          const createdUserId = Number(body.createdUserId || 1)
          const attachment = await ServiceTblAttachment.createWithFile({
            title: body.title,
            attachmentTypeId: Number(body.attachmentTypeId),
            isUserAttachment: body.isUserAttachment === 'true',
            createdUserId,
            buffer,
            originalFileName: fileName,
            mimeType,
          })

          set.status = 201
          return attachment
        } catch (error) {
          set.status = 500
          return {
            error: error instanceof Error ? error.message : 'Unknown error',
          }
        }
      },
      {
        tags: ['tblAttachment'],
        detail: { summary: 'Upload file' },
        body: t.Object({
          title: t.Optional(t.String()),
          attachmentTypeId: t.Optional(t.String()),
          isUserAttachment: t.Optional(t.String()),
          createdUserId: t.Optional(t.String()),
          file: t.File(),
        }),
        type: 'multipart/form-data',
        response: t.Union([
          t.Object({
            /* Attachment Schema */
          }),
          t.Object({
            error: t.String(),
            code: t.Optional(t.String()),
          }),
        ]),
      }
    )

    // GET /:attachmentId/download - Download file
    app.get(
      '/:attachmentId/download',
      async ({ params, set }) => {
        try {
          const attachmentId = Number(params.attachmentId)

          const fileData =
            await ServiceTblAttachment.getFileForDownload(attachmentId)

          const headers = FileService.getDownloadHeaders(
            fileData.originalName,
            fileData.mimeType
          )

          set.headers = headers
          set.status = 200

          return fileData.buffer
        } catch (error) {
          set.status = 404
          return new TextEncoder().encode(
            error instanceof Error ? error.message : 'File not found'
          )
        }
      },
      {
        tags: ['tblAttachment'],
        detail: { summary: 'Download file' },
        params: t.Object({ attachmentId: t.Number() }),
      }
    )

    // DELETE /:attachmentId - Delete with file cleanup
    app.delete(
      '/:attachmentId',
      async ({ params, query, set }) => {
        try {
          const attachmentId = Number(params.attachmentId)

          const deleted = await ServiceTblAttachment.deleteWithFile(
            { attachmentId },
            { force: query.force }
          )

          set.status = 200
          return deleted
        } catch (error) {
          set.status = 500
          return {
            error: error instanceof Error ? error.message : 'Delete failed',
          }
        }
      },
      {
        tags: ['tblAttachment'],
        detail: { summary: 'Delete attachment' },
        params: t.Object({ attachmentId: t.Number() }),
        query: t.Object({ force: t.Optional(t.Boolean()) }),
      }
    )
  },
})

const ControllerTblAttachment = baseController.app

export default ControllerTblAttachment
