import AttachmentMap from '@/shared/tabs/attachmentMap/AttachmentMap'
import { memo } from 'react'
import {
  tblCompTypeAttachment,
  TypeTblCompType,
} from '@/core/api/generated/api'

type Props = {
  compType?: TypeTblCompType | null
  label?: string
}

export function TabCompTypeAttachment({ compType }: Props) {
  return (
    <AttachmentMap
      filterId={compType?.compTypeId}
      filterKey='compTypeId'
      relName='tblCompType'
      tableId='compTypeAttachmentId'
      label='Attachments'
      mapService={tblCompTypeAttachment}
    />
  )
}

export default memo(TabCompTypeAttachment)
