import CustomizedDataGrid from '@/shared/components/dataGrid/DataGrid'
import AttachmentUpsert from './AttachmentUpsert'
import CellFileSize from '@/shared/components/dataGrid/cells/CellFileSize'
import CellDateTime from '@/shared/components/dataGrid/cells/CellDateTime'
import CellDownload from '@/shared/components/dataGrid/cells/CellDownload'
import { type GridColDef } from '@mui/x-data-grid'
import { useCallback, useState } from 'react'
import { useDataGrid } from '@/shared/hooks/useDataGrid'
import { tblAttachment, TypeTblAttachment } from '@/core/api/generated/api'

const getRowId = (row: TypeTblAttachment) => row.attachmentId

// === Columns ===
const columns: GridColDef<TypeTblAttachment>[] = [
  {
    field: 'Link',
    headerName: 'Link',
    width: 55,
    renderCell: ({ row }) => <CellDownload attachmentId={row.attachmentId} />,
  },
  { field: 'title', headerName: 'Title', flex: 1 },
  { field: 'fileName', headerName: 'File Name', flex: 1 },
  {
    field: 'attachmentType',
    headerName: 'Attachment Type',
    width: 200,
    valueGetter: (_, row) => row?.tblAttachmentType?.name,
  },
  {
    field: 'size',
    headerName: 'Size',
    width: 100,
    renderCell: ({ value }) => <CellFileSize value={value} />,
  },
  {
    field: 'isUserAttachment',
    headerName: 'User Attachment',
    type: 'boolean',
    width: 135,
  },
  {
    field: 'createdAt',
    headerName: 'Created At',
    width: 150,
    renderCell: ({ value }) => <CellDateTime value={value} />,
  },
]

export default function PageAttachment() {
  const [selectedRowId, setSelectedRowId] = useState<null | number>(null)
  const [openForm, setOpenForm] = useState(false)
  const [mode, setMode] = useState<'create' | 'update'>('create')

  const getAll = useCallback(
    () => tblAttachment.getAll({ include: { tblAttachmentType: true } }),
    []
  )
  // === useDataGrid ===
  const { rows, loading, handleDelete, handleRefresh } = useDataGrid(
    getAll,
    tblAttachment.deleteById,
    'attachmentId'
  )

  // === Handlers ===
  const handleCreate = useCallback(() => {
    setSelectedRowId(null)
    setMode('create')
    handleUpsertOpen()
  }, [])

  const handleUpsertClose = useCallback(() => {
    setOpenForm(false)
  }, [])

  const handleUpsertOpen = useCallback(() => {
    setOpenForm(true)
  }, [])

  return (
    <>
      <CustomizedDataGrid
        showToolbar
        disableRowNumber
        disableEdit
        label='Attachments'
        rows={rows}
        columns={columns}
        loading={loading}
        onDeleteClick={handleDelete}
        onAddClick={handleCreate}
        onRefreshClick={handleRefresh}
        getRowId={getRowId}
      />

      <AttachmentUpsert
        open={openForm}
        mode={mode}
        recordId={selectedRowId}
        onClose={handleUpsertClose}
        onSuccess={handleRefresh}
      />
    </>
  )
}
