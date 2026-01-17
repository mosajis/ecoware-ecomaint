import AttachmentMapUpsert from './AttachmentMapUpsert'
import DataGrid from '@/shared/components/dataGrid/DataGrid'
import { memo, useCallback, useMemo, useState } from 'react'
import { useDataGrid } from '@/shared/hooks/useDataGrid'
import { BaseAttachmentGridProps, MapRelationConfig } from './AttachmentType'
import { attachmentTableColumns } from './AttachmentColumn'

function AttachmentMap<T = any>({
  disableAdd,
  disableDelete,
  filterId,
  filterKey,
  relName,
  tableId,
  label = 'Attachments',
  mapService,
}: BaseAttachmentGridProps<T>) {
  const [openForm, setOpenForm] = useState(false)

  const getAll = useCallback(() => {
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

  const openUpsert = useCallback(() => {
    setOpenForm(true)
  }, [])

  const closeUpsert = useCallback(() => {
    setOpenForm(false)
  }, [])

  const relationConfig: MapRelationConfig = useMemo(
    () => ({
      filterId,
      filterKey,
      relName,
      attachmentField: 'tblAttachment',
    }),
    [filterKey, filterId]
  )

  const getRowId = useCallback((row: any) => row[tableId], [tableId])

  return (
    <>
      <DataGrid
        disableAdd={disableAdd}
        disableDelete={disableDelete}
        disableRowNumber
        disableEdit
        label={label}
        showToolbar={!!filterId}
        rows={rows}
        columns={attachmentTableColumns}
        loading={loading}
        onDeleteClick={handleDelete}
        onAddClick={openUpsert}
        onRefreshClick={handleRefresh}
        getRowId={getRowId}
      />

      <AttachmentMapUpsert<T>
        mapService={mapService}
        open={openForm}
        relationConfig={relationConfig}
        onClose={closeUpsert}
        onSuccess={handleRefresh}
      />
    </>
  )
}

export default memo(AttachmentMap)
