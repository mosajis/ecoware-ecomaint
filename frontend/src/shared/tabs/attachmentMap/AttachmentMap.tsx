import AttachmentMapUpsert from './AttachmentMapUpsert'
import DataGrid from '@/shared/components/dataGrid/DataGrid'
import { memo, useCallback, useMemo, useState } from 'react'
import { dataGridActionColumn } from '@/shared/components/dataGrid/DataGridActionsColumn'
import { useDataGrid } from '@/shared/hooks/useDataGrid'
import { attachmentGridColumns } from './AttachmentColumn'
import { BaseAttachmentGridProps, MapRelationConfig } from './AttachmentType'
import { type GridColDef } from '@mui/x-data-grid'

function AttachmentMap<T = any>({
  filterId,
  filterKey,
  relName,
  tableId,
  label = 'Attachments',
  mapService,
}: BaseAttachmentGridProps<T>) {
  const [openForm, setOpenForm] = useState(false)

  const getAll = useCallback(() => {
    if (!filterId) return Promise.resolve({ items: [] })

    return mapService.getAll({
      filter: {
        [filterKey]: filterId,
      },
      include: {
        tblAttachment: {
          include: {
            tblAttachmentType: true,
          },
        },
      },
    })
  }, [filterId, filterKey, mapService])

  const { rows, loading, handleDelete, handleRefresh } = useDataGrid(
    getAll,
    mapService.deleteById,
    tableId as any,
    !!filterId
  )

  const handleCreate = useCallback(() => {
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
      filterId,
      filterKey,
      relName,
      attachmentField: 'tblAttachment',
    }),
    [filterKey, filterId]
  )

  return (
    <>
      <DataGrid
        label={label}
        showToolbar={!!filterId}
        disableRowNumber
        onAddClick={handleCreate}
        onRefreshClick={handleRefresh}
        rows={rows}
        columns={columns}
        loading={loading}
        getRowId={row => row[tableId]}
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
