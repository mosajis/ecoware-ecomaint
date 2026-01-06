import { TypeTblAttachment } from '@/core/api/generated/api'

export type AttachmentFormMode = 'existing' | 'new'

export interface AttachmentOption {
  attachmentTypeId: number
  name: string
}

export interface ExistingAttachmentFormValues {
  selectedAttachmentId: number | null
}

export interface NewAttachmentFormValues {
  title: string
  attachmentType: AttachmentOption | null
  isUserAttachment: boolean
  file: File
}

export interface MapRelationConfig {
  filterId?: number | null
  filterKey: string
  relName: string
  attachmentField: string
}

export interface AttachmentMapService<T = any> {
  create: (payload: any) => Promise<T>
}

export interface AttachmentMapService<T = any> {
  create: (payload: any) => Promise<T>
  getAll: (params?: any) => Promise<{ items: T[] }>
  deleteById: (id: number) => Promise<T>
}

export interface BaseAttachmentUpsertProps<T = any> {
  open: boolean
  relationConfig: MapRelationConfig
  mapService: AttachmentMapService<T>
  onClose: () => void
  onSuccess: (data: T) => void
}

export interface BaseAttachmentGridProps<T = any> {
  filterId?: number | null
  filterKey: string
  relName: string
  tableId: string
  label?: string
  mapService: AttachmentMapService<T>
}
