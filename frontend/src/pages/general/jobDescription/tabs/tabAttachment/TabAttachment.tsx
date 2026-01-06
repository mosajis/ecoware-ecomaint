import AttachmentMap from '@/shared/tabs/attachmentMap/AttachmentMap'
import { memo } from 'react'
import { tblJobDescriptionAttachment } from '@/core/api/generated/api'

interface TabJobDescriptionAttachmentProps {
  jobDescriptionId?: number | null | undefined
}

export function TabJobDescriptionAttachment({
  jobDescriptionId,
}: TabJobDescriptionAttachmentProps) {
  return (
    <AttachmentMap
      filterId={jobDescriptionId}
      filterKey='jobDescId'
      relName='tblJobDescription'
      tableId='jobDescriptionAttachmentId'
      label='Attachments'
      mapService={tblJobDescriptionAttachment}
    />
  )
}

export default memo(TabJobDescriptionAttachment)
