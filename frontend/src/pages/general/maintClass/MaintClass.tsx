import MaintClassFormDialog from './MaintClassUpsert.js'
import MaintTypeFormDialog from './MaintTypeUpsert.js'
import MaintCauseFormDialog from './MaintCauseUpsert.js'
import Splitter from '@/shared/components/Splitter/Splitter.js'
import CustomizedDataGrid from '@/shared/components/dataGrid/DataGrid'
import { useState, useCallback } from 'react'
import { GridColDef } from '@mui/x-data-grid'
import { useDataGrid } from '@/shared/hooks/useDataGrid.js'
import {
  tblMaintType,
  tblMaintClass,
  tblMaintCause,
  TypeTblMaintCause,
  TypeTblMaintType,
  TypeTblMaintClass,
} from '@/core/api/generated/api'

const getRowIdClass = (row: TypeTblMaintClass) => row.maintClassId
const getRowIdCause = (row: TypeTblMaintCause) => row.maintCauseId
const getRowIdType = (row: TypeTblMaintType) => row.maintTypeId

const columns: GridColDef<any>[] = [
  { field: 'descr', headerName: 'Description', flex: 1 },
  { field: 'orderNo', headerName: 'Order No', width: 80 },
]

export default function PageMaintClass() {
  // ---------------- Maint Type ----------------
  const {
    rows: typeRows,
    loading: loadingType,
    handleDelete: handleDeleteType,
    handleRefresh: refreshType,
  } = useDataGrid(tblMaintType.getAll, tblMaintType.deleteById, 'maintTypeId')

  const [openType, setOpenType] = useState(false)
  const [modeType, setModeType] = useState<'create' | 'update'>('create')
  const [selectedTypeId, setSelectedTypeId] = useState<number | null>(null)

  const openUpsertMaintType = useCallback(
    (mode: 'create' | 'update' = 'create', id?: number) => {
      setModeType(mode)
      setSelectedTypeId(id ?? null)
      setOpenType(true)
    },
    []
  )

  const closeUpsertMaintType = useCallback(() => {
    setOpenType(false)
  }, [])

  // ---------------- Maint Class ----------------
  const {
    rows: classRows,
    loading: loadingClass,
    handleDelete: handleDeleteClass,
    handleRefresh: refreshClass,
  } = useDataGrid(
    tblMaintClass.getAll,
    tblMaintClass.deleteById,
    'maintClassId'
  )

  const [openClass, setOpenClass] = useState(false)
  const [modeClass, setModeClass] = useState<'create' | 'update'>('create')
  const [selectedClassId, setSelectedClassId] = useState<number | null>(null)

  const openUpsertMaintClass = useCallback(
    (mode: 'create' | 'update' = 'create', id?: number) => {
      setModeClass(mode)
      setSelectedClassId(id ?? null)
      setOpenClass(true)
    },
    []
  )

  const closeUpsertMaintClass = useCallback(() => {
    setOpenClass(false)
  }, [])

  // ---------------- Maint Cause ----------------

  const {
    rows: causeRows,
    loading: loadingCause,
    handleDelete: handleDeleteCause,
    handleRefresh: refreshCause,
  } = useDataGrid(
    tblMaintCause.getAll,
    tblMaintCause.deleteById,
    'maintCauseId'
  )

  const [openCause, setOpenCause] = useState(false)
  const [modeCause, setModeCause] = useState<'create' | 'update'>('create')
  const [selectedCauseId, setSelectedCauseId] = useState<number | null>(null)

  const openUpsertMaintCause = useCallback(
    (mode: 'create' | 'update' = 'create', id?: number) => {
      setModeCause(mode)
      setSelectedCauseId(id ?? null)
      setOpenCause(true)
    },
    []
  )

  const closeUpsertMaintCause = useCallback(() => {
    setOpenCause(false)
  }, [])

  return (
    <>
      <Splitter initialPrimarySize='34%'>
        <CustomizedDataGrid
          showToolbar
          disableColumns
          disableExport
          disableRefresh
          label='Maint Class'
          rows={classRows}
          columns={columns}
          loading={loadingClass}
          onEditClick={rowId => openUpsertMaintClass('update', rowId)}
          onDoubleClick={rowId => openUpsertMaintClass('update', rowId)}
          onAddClick={() => openUpsertMaintClass()}
          onDeleteClick={handleDeleteClass}
          onRefreshClick={refreshClass}
          getRowId={getRowIdClass}
        />

        <Splitter initialPrimarySize='50%'>
          <CustomizedDataGrid
            showToolbar
            disableColumns
            disableExport
            disableRefresh
            label='Maint Type'
            rows={typeRows}
            columns={columns}
            loading={loadingType}
            onEditClick={rowId => openUpsertMaintType('update', rowId)}
            onDoubleClick={rowId => openUpsertMaintType('update', rowId)}
            onAddClick={() => openUpsertMaintType()}
            onDeleteClick={handleDeleteType}
            onRefreshClick={refreshType}
            getRowId={getRowIdType}
          />

          <CustomizedDataGrid
            showToolbar
            disableColumns
            disableExport
            disableRefresh
            label='Maint Cause'
            rows={causeRows}
            columns={columns}
            loading={loadingCause}
            onEditClick={rowId => openUpsertMaintCause('update', rowId)}
            onDoubleClick={rowId => openUpsertMaintCause('update', rowId)}
            onAddClick={() => openUpsertMaintCause()}
            onDeleteClick={handleDeleteCause}
            onRefreshClick={refreshCause}
            getRowId={getRowIdCause}
          />
        </Splitter>
      </Splitter>

      <MaintTypeFormDialog
        open={openType}
        mode={modeType}
        recordId={selectedTypeId}
        onClose={closeUpsertMaintType}
        onSuccess={refreshType}
      />

      <MaintClassFormDialog
        open={openClass}
        mode={modeClass}
        recordId={selectedClassId}
        onClose={closeUpsertMaintClass}
        onSuccess={refreshClass}
      />

      <MaintCauseFormDialog
        open={openCause}
        mode={modeCause}
        recordId={selectedCauseId}
        onClose={closeUpsertMaintCause}
        onSuccess={refreshCause}
      />
    </>
  )
}
