import { useState, useEffect, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAtomValue } from 'jotai'
import { atomUser } from '@/pages/auth/auth.atom'
import { tblAttachment, TypeTblAttachment } from '@/core/api/generated/api'
import { buildRelation } from '@/core/api/helper'
import {
  existingAttachmentSchema,
  newAttachmentSchema,
} from './AttachmentMapSchema'
import {
  ExistingAttachmentFormValues,
  NewAttachmentFormValues,
  AttachmentFormMode,
  MapRelationConfig,
  AttachmentMapService,
} from './AttachmentType'
import { createAttachment } from '@/pages/general/attachment/AttachmentService'

interface UseAttachmentFormProps<T> {
  open: boolean
  relationConfig: MapRelationConfig
  mapService: AttachmentMapService<T>
  onSuccess: (data: T) => void
  onClose: () => void
}

export function useAttachmentForm<T>({
  open,
  relationConfig,
  mapService,
  onSuccess,
  onClose,
}: UseAttachmentFormProps<T>) {
  const [activeTab, setActiveTab] = useState<AttachmentFormMode>('new')
  const [submitting, setSubmitting] = useState(false)
  const [selectedAttachmentId, setSelectedAttachmentId] = useState<
    number | null
  >(null)
  const [attachments, setAttachments] = useState<TypeTblAttachment[]>([])
  const [loadingAttachments, setLoadingAttachments] = useState(false)

  const user = useAtomValue(atomUser)

  const existingForm = useForm<ExistingAttachmentFormValues>({
    resolver: zodResolver(existingAttachmentSchema),
    defaultValues: { selectedAttachmentId: null },
    mode: 'onChange',
  })

  const newForm = useForm<NewAttachmentFormValues>({
    resolver: zodResolver(newAttachmentSchema),
    defaultValues: {
      title: '',
      attachmentType: null,
      isUserAttachment: true,
      file: new File([], ''),
    },
    mode: 'onChange',
  })

  const selectedFile = newForm.watch('file')

  // Auto-fill title from filename
  useEffect(() => {
    const fileName = selectedFile?.name?.trim()
    if (!fileName) {
      newForm.setValue('title', '')
      return
    }

    const lastDotIndex = fileName.lastIndexOf('.')
    const nameWithoutExtension =
      lastDotIndex === -1 ? fileName : fileName.substring(0, lastDotIndex)

    const currentTitle = newForm.watch('title')
    if (!currentTitle?.trim()) {
      newForm.setValue('title', nameWithoutExtension)
    }
  }, [selectedFile, newForm])

  const loadAttachments = useCallback(async () => {
    setLoadingAttachments(true)
    try {
      const res = await tblAttachment.getAll({
        include: { tblAttachmentType: true },
      })
      setAttachments(res.items ?? [])
    } catch (err) {
      console.error('Failed to load attachments', err)
    } finally {
      setLoadingAttachments(false)
    }
  }, [])

  const resetForms = useCallback(() => {
    existingForm.reset({ selectedAttachmentId: null })
    newForm.reset({
      title: '',
      attachmentType: null,
      isUserAttachment: true,
      file: new File([], ''),
    })
    setSelectedAttachmentId(null)
  }, [existingForm, newForm])

  useEffect(() => {
    if (open) {
      resetForms()
      loadAttachments()
    }
  }, [open, resetForms, loadAttachments])

  const handleExistingSubmit = useCallback(
    async (values: ExistingAttachmentFormValues) => {
      if (!selectedAttachmentId) {
        alert('Please select an attachment')
        return
      }

      setSubmitting(true)

      try {
        const mapPayload = {
          orderNo: 0,
          ...buildRelation(
            relationConfig.relName,
            relationConfig.filterKey,
            relationConfig.filterId
          ),
          ...buildRelation(
            relationConfig.attachmentField,
            'attachmentId',
            selectedAttachmentId
          ),
          ...buildRelation('tblUsers', 'userId', user?.userId),
        }

        const result = await mapService.create(mapPayload)

        if (result) {
          onSuccess(result)
          onClose()
        }
      } catch (err) {
        console.error('Failed to submit existing attachment', err)
      } finally {
        setSubmitting(false)
      }
    },
    [
      selectedAttachmentId,
      relationConfig,
      mapService,
      user?.userId,
      onSuccess,
      onClose,
    ]
  )

  const handleNewSubmit = useCallback(
    async (values: NewAttachmentFormValues) => {
      setSubmitting(true)
      try {
        const newAttachment = await createAttachment({
          title: values.title,
          attachmentTypeId: values.attachmentType?.attachmentTypeId || 0,
          isUserAttachment: values.isUserAttachment,
          file: values.file,
          createdUserId: user?.userId || 0,
        })

        if (!newAttachment) {
          throw new Error('Failed to create attachment')
        }

        const mapPayload = {
          orderNo: 0,
          ...buildRelation(
            relationConfig.relName,
            relationConfig.filterKey,
            relationConfig.filterId
          ),
          ...buildRelation(
            relationConfig.attachmentField,
            'attachmentId',
            newAttachment.attachmentId
          ),
          ...buildRelation('tblUsers', 'userId', user?.userId),
        }

        const result = await mapService.create(mapPayload)

        if (result) {
          onSuccess(result)
          onClose()
        }
      } catch (err) {
        console.error('Failed to submit new attachment', err)
      } finally {
        setSubmitting(false)
      }
    },
    [relationConfig, mapService, user?.userId, onSuccess, onClose]
  )

  return {
    activeTab,
    setActiveTab,
    submitting,
    selectedAttachmentId,
    setSelectedAttachmentId,
    attachments,
    loadingAttachments,
    existingForm,
    newForm,
    handleExistingSubmit,
    handleNewSubmit,
  }
}
