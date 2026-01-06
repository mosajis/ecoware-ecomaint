import { memo } from 'react'
import Box from '@mui/material/Box'
import DataGrid from '@/shared/components/dataGrid/DataGrid'
import { TypeTblAttachment } from '@/core/api/generated/api'
import { attachmentColumns } from '../AttachmentColumn'

interface ExistingAttachmentTabProps {
  attachments: TypeTblAttachment[]
  loading: boolean
  selectedAttachmentId: number | null
  onSelectionChange: (id: number | null) => void
}

function TabAttachmentExisting({
  attachments,
  loading,
  selectedAttachmentId,
  onSelectionChange,
}: ExistingAttachmentTabProps) {
  return (
    <Box display='flex' flexDirection='column' gap={2} height='350px'>
      <DataGrid
        rows={attachments}
        columns={attachmentColumns}
        loading={loading}
        getRowId={row => row.attachmentId}
        label='Attachments'
        checkboxSelection
        disableRowNumber
        disableMultipleRowSelection
        // rowSelectionModel={selectedAttachmentId ? [selectedAttachmentId] : []}
        // onRowSelectionModelChange={model => {
        //   onSelectionChange((model[0] as number) ?? null)
        // }}
        disableAdd
        disableRefresh
        initialState={{
          pagination: { paginationModel: { pageSize: 10 } },
        }}
        sx={{ height: 400 }}
      />
    </Box>
  )
}

export default memo(TabAttachmentExisting)
