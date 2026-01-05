import CustomizedDataGrid from '@/shared/components/dataGrid/DataGrid'
import AttachmentUpsert from './TabAttachmentUpsert'
import CellFileSize from '@/shared/components/dataGrid/cells/CellFileSize'
import CellDateTime from '@/shared/components/dataGrid/cells/CellDateTime'
import CellDownload from '@/shared/components/dataGrid/cells/CellDownload'
import { type GridColDef } from '@mui/x-data-grid'
import { useCallback, useMemo, useState } from 'react'
import { dataGridActionColumn } from '@/shared/components/dataGrid/DataGridActionsColumn'
import { useDataGrid } from '@/shared/hooks/useDataGrid'
import {
  tblAttachment,
  tblAttachmentType,
  tblJobDescriptionAttachment,
  TypeTblAttachment,
} from '@/core/api/generated/api'

type Props = {
  jobDescriptionId?: number | undefined | null
}
export default function TabAttachment({ jobDescriptionId }: Props) {
  const [selectedRowId, setSelectedRowId] = useState<undefined | number>(
    undefined
  )
  const [openForm, setOpenForm] = useState(false)
  const [mode, setMode] = useState<'create' | 'update'>('create')

  const getAll = useCallback(
    () =>
      tblJobDescriptionAttachment.getAll({
        filter: {
          jobDescriptionId,
        },
        include: {
          tblAttachment: {
            include: {
              tblAttachmentType: true,
            },
          },
        },
      }),
    []
  )
  // === useDataGrid ===
  const { rows, loading, handleDelete, handleFormSuccess, handleRefresh } =
    useDataGrid(getAll, tblAttachment.deleteById, 'attachmentId')

  // === Handlers ===
  const handleCreate = useCallback(() => {
    setSelectedRowId(undefined)
    setMode('create')
    setOpenForm(true)
  }, [])

  const handleEdit = useCallback((row: TypeTblAttachment) => {
    setSelectedRowId(row.attachmentId)
    setMode('update')
    setOpenForm(true)
  }, [])

  // === Columns ===
  const columns = useMemo<GridColDef<TypeTblAttachment>[]>(
    () => [
      {
        field: 'Link',
        headerName: 'Link',
        width: 55,
        renderCell: ({ row }) => (
          <CellDownload attachmentId={row.attachmentId} />
        ),
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
      dataGridActionColumn({ onEdit: handleEdit, onDelete: handleDelete }),
    ],
    [handleEdit, handleDelete]
  )

  return (
    <>
      <CustomizedDataGrid
        label='Attachments'
        showToolbar
        disableRowNumber
        onAddClick={handleCreate}
        onRefreshClick={handleRefresh}
        rows={rows}
        columns={columns}
        loading={loading}
        getRowId={row => row.attachmentId}
      />

      {jobDescriptionId && (
        <AttachmentUpsert
          jobDescId={jobDescriptionId}
          open={openForm}
          mode={mode}
          recordId={selectedRowId}
          onClose={() => setOpenForm(false)}
          onSuccess={record => {
            handleFormSuccess(record)
            setOpenForm(false)
          }}
        />
      )}
    </>
  )
}
