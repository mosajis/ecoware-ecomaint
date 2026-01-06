import CustomizedDataGrid from '@/shared/components/dataGrid/DataGrid'
import AttachmentUpsert from './TabAttachmentUpsert'
import CellFileSize from '@/shared/components/dataGrid/cells/CellFileSize'
import CellDownload from '@/shared/components/dataGrid/cells/CellDownload'
import { type GridColDef } from '@mui/x-data-grid'
import { useCallback, useMemo, useState } from 'react'
import { dataGridActionColumn } from '@/shared/components/dataGrid/DataGridActionsColumn'
import { useDataGrid } from '@/shared/hooks/useDataGrid'
import {
  tblAttachment,
  tblJobDescriptionAttachment,
  TypeTblJobDescriptionAttachment,
} from '@/core/api/generated/api'

type Props = {
  jobDescriptionId?: number | undefined | null
}

export default function TabAttachment({ jobDescriptionId }: Props) {
  const [selectedRowId, setSelectedRowId] = useState<undefined | number>(
    undefined
  )
  const [openForm, setOpenForm] = useState(false)

  const getAll = useCallback(
    () =>
      tblJobDescriptionAttachment.getAll({
        filter: {
          jobDescId: jobDescriptionId,
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
    setOpenForm(true)
  }, [])

  // === Columns ===
  const columns = useMemo<GridColDef<TypeTblJobDescriptionAttachment>[]>(
    () => [
      {
        field: 'Link',
        headerName: 'Link',
        width: 55,
        renderCell: ({ row }) => (
          <CellDownload attachmentId={row?.tblAttachment?.attachmentId} />
        ),
      },
      {
        field: 'title',
        headerName: 'Title',
        flex: 1,
        valueGetter: (_, row) => row?.tblAttachment?.title,
      },
      {
        field: 'attachmentType',
        headerName: 'Attachment Type',
        width: 200,
        // @ts-ignore
        valueGetter: (_, row) => row?.tblAttachment?.tblAttachmentType?.name,
      },
      {
        field: 'size',
        headerName: 'Size',
        width: 100,
        renderCell: ({ row }) => (
          <CellFileSize value={row.tblAttachment?.size} />
        ),
      },
      {
        field: 'isUserAttachment',
        headerName: 'User Attachment',
        type: 'boolean',
        valueGetter: (_, row) => row?.tblAttachment?.isUserAttachment,
        width: 135,
      },

      dataGridActionColumn({ onDelete: handleDelete }),
    ],
    [handleDelete]
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
          mode={'create'}
          recordId={selectedRowId}
          onClose={() => setOpenForm(false)}
          onSuccess={handleRefresh}
        />
      )}
    </>
  )
}
