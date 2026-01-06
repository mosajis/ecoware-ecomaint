import AttachmentMap from '@/shared/tabs/attachmentMap/AttachmentMap'
import { memo } from 'react'
import {
  tblMaintLogAttachment,
  TypeTblMaintLog,
} from '@/core/api/generated/api'

type Props = {
  selected: TypeTblMaintLog
  label?: string
}

export function TabMaintLogAttachment({ selected }: Props) {
  return (
    <AttachmentMap
      filterId={selected?.maintLogId}
      filterKey='maintLogId'
      relName='tblMaintLog'
      tableId='maintLogAttachmentId'
      label='Attachments'
      mapService={tblMaintLogAttachment}
    />
  )
}

export default memo(TabMaintLogAttachment)
