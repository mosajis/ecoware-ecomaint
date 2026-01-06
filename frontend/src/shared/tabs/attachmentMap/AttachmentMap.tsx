import AttachmentMapUpsert from './AttachmentMapUpsert'
import DataGrid from '@/shared/components/dataGrid/DataGrid'
import { memo, useCallback, useMemo, useState } from 'react'
import { dataGridActionColumn } from '@/shared/components/dataGrid/DataGridActionsColumn'
import { useDataGrid } from '@/shared/hooks/useDataGrid'
import { attachmentGridColumns } from './AttachmentColumn'
import { BaseAttachmentGridProps, MapRelationConfig } from './AttachmentType'
import { type GridColDef } from '@mui/x-data-grid'

function AttachmentMap<T = any>({
  parentId,
  parentIdField,
  mapService,
  mapIdField,
  label = 'Attachments',
}: BaseAttachmentGridProps<T>) {
  const [selectedRowId, setSelectedRowId] = useState<number | undefined>(
    undefined
  )
  const [openForm, setOpenForm] = useState(false)

  const getAll = useCallback(
    () =>
      mapService.getAll({
        filter: {
          [parentIdField]: parentId,
        },
        include: {
          tblAttachment: {
            include: {
              tblAttachmentType: true,
            },
          },
        },
      }),
    [parentId, parentIdField, mapService]
  )

  const { rows, loading, handleDelete, handleRefresh } = useDataGrid(
    getAll,
    mapService.deleteById,
    mapIdField as any
  )

  const handleCreate = useCallback(() => {
    setSelectedRowId(undefined)
    setOpenForm(true)
  }, [])

  const columns = useMemo<GridColDef[]>(
    () => [
      ...attachmentGridColumns,
      dataGridActionColumn({ onDelete: handleDelete }),
    ],
    [handleDelete]
  )

  const relationConfig: MapRelationConfig = useMemo(
    () => ({
      parentField: parentIdField.replace('Id', ''),
      parentId: parentId ?? 0,
      attachmentField: 'tblAttachment',
    }),
    [parentIdField, parentId]
  )

  if (!parentId) {
    return null
  }

  return (
    <>
      <DataGrid
        label={label}
        showToolbar
        disableRowNumber
        onAddClick={handleCreate}
        onRefreshClick={handleRefresh}
        rows={rows}
        columns={columns}
        loading={loading}
        getRowId={row => row[mapIdField]}
      />

      <AttachmentMapUpsert<T>
        open={openForm}
        relationConfig={relationConfig}
        mapService={mapService}
        onClose={() => setOpenForm(false)}
        onSuccess={handleRefresh}
      />
    </>
  )
}

export default memo(AttachmentMap)
