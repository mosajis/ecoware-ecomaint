// attachmentService.ts
import { TypeTblAttachment } from '@/core/api/generated/api'
import { api } from '@/service/axios'
import axios from 'axios'
import { toast } from 'sonner'

export type CreateAttachmentPayload = {
  file: File
  title: string
  attachmentTypeId: number
  isUserAttachment: boolean
  createdUserId: number
}

/**
 * Create attachment using FormData (file upload) with Axios
 */
export async function createAttachment(
  payload: CreateAttachmentPayload
): Promise<TypeTblAttachment> {
  const form = new FormData()
  form.append('file', payload.file)
  form.append('title', payload.title)
  form.append('attachmentTypeId', String(payload.attachmentTypeId))
  form.append('isUserAttachment', String(payload.isUserAttachment))
  form.append('createdUserId', String(payload.createdUserId))

  try {
    const res = await axios.post<TypeTblAttachment>(
      'http://localhost:5273/tblAttachment',
      form
    )
    return res.data
  } catch (err: any) {
    if (err.response) {
      throw new Error(
        `Failed to create attachment: ${err.response.status} ${err.response.statusText}`
      )
    }
    throw new Error(`Failed to create attachment: ${err.message}`)
  }
}

export async function downloadAttachment(attachmentId: number): Promise<void> {
  const response = await fetch(`/tblAttachment/${attachmentId}/download`, {
    method: 'GET',
  })

  if (!response.ok) {
    const errorText = 'Download failed'

    toast.error(errorText)

    throw new Error(errorText)
  }

  const blob = await response.blob()

  const contentDisposition = response.headers.get('content-disposition')
  let fileName = 'download-file'

  if (contentDisposition) {
    const match = contentDisposition.match(/filename="?(.+)"?/)
    if (match?.[1]) {
      fileName = decodeURIComponent(match[1])
    }
  }

  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = fileName
  document.body.appendChild(a)
  a.click()

  a.remove()
  window.URL.revokeObjectURL(url)
}
