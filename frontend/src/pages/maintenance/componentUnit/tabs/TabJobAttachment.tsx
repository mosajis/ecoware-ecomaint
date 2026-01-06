import AttachmentMap from '@/shared/tabs/attachmentMap/AttachmentMap'
import { memo } from 'react'
import {
  tblComponentUnitAttachment,
  tblMaintLogAttachment,
  TypeTblComponentUnit,
} from '@/core/api/generated/api'

interface Props {
  componentUnit?: TypeTblComponentUnit | null
  label?: string | null
}

export function TabMaintLogAttachment({ componentUnit }: Props) {
  return (
    <AttachmentMap
      filterId={componentUnit?.compId}
      filterKey='compId'
      relName='tblMaintLogAttachment'
      tableId='maintLogAttachmentId'
      label='Attachments'
      mapService={tblMaintLogAttachment}
    />
  )
}

export default memo(TabMaintLogAttachment)
