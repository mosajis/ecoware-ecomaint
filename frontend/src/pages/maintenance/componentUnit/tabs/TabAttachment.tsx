import AttachmentMap from '@/shared/tabs/attachmentMap/AttachmentMap'
import { memo } from 'react'
import {
  tblComponentUnitAttachment,
  TypeTblComponentUnit,
} from '@/core/api/generated/api'

interface Props {
  componentUnit?: TypeTblComponentUnit | null
  label?: string | null
}

export function TabComponentUnitAttachment({ componentUnit }: Props) {
  return (
    <AttachmentMap
      filterId={componentUnit?.compId}
      filterKey='compId'
      relName='tblComponentUnit'
      tableId='componentUnitAttachmentId'
      label='Attachments'
      mapService={tblComponentUnitAttachment}
    />
  )
}

export default memo(TabComponentUnitAttachment)
