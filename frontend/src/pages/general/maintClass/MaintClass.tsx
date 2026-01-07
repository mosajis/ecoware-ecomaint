import MaintClassFormDialog from './MaintClassUpsert.js'
import MaintTypeFormDialog from './MaintTypeUpsert.js'
import MaintCauseFormDialog from './MaintCauseUpsert.js'
import Splitter from '@/shared/components/Splitter/Splitter.js'
import CustomizedDataGrid from '@/shared/components/dataGrid/DataGrid'
import { useState, useCallback } from 'react'
import { dataGridActionColumn } from '@/shared/components/dataGrid/DataGridActionsColumn'
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

export default function PageMaintClass() {
  // ---------------- Maint Type ----------------
  const {
    rows: typeRows,
    loading: loadingType,
    handleDelete: handleDeleteType,
    handleFormSuccess: handleTypeSuccess,
    handleRefresh: refreshType,
  } = useDataGrid(tblMaintType.getAll, tblMaintType.deleteById, 'maintTypeId')

  const typeColumns: GridColDef<TypeTblMaintType>[] = [
    { field: 'descr', headerName: 'Description', flex: 1 },
    { field: 'orderNo', headerName: 'Order No', width: 100 },
    dataGridActionColumn({
      onEdit: row => openTypeForm('update', row.maintTypeId),
      onDelete: handleDeleteType,
    }),
  ]

  const [openType, setOpenType] = useState(false)
  const [modeType, setModeType] = useState<'create' | 'update'>('create')
  const [selectedTypeId, setSelectedTypeId] = useState<number | null>(null)

  const openTypeForm = useCallback((mode: 'create' | 'update', id?: number) => {
    setModeType(mode)
    setSelectedTypeId(id ?? null)
    setOpenType(true)
  }, [])

  const {
    rows: classRows,
    loading: loadingClass,
    handleDelete: handleDeleteClass,
    handleFormSuccess: handleClassSuccess,
    handleRefresh: refreshClass,
  } = useDataGrid(
    tblMaintClass.getAll,
    tblMaintClass.deleteById,
    'maintClassId'
  )

  const classColumns: GridColDef<TypeTblMaintClass>[] = [
    { field: 'descr', headerName: 'Description', flex: 1 },
    { field: 'orderNo', headerName: 'Order No', width: 100 },
    dataGridActionColumn({
      onEdit: row => openClassForm('update', row.maintClassId),
      onDelete: handleDeleteClass,
    }),
  ]

  const [openClass, setOpenClass] = useState(false)
  const [modeClass, setModeClass] = useState<'create' | 'update'>('create')
  const [selectedClassId, setSelectedClassId] = useState<number | null>(null)

  const openClassForm = useCallback(
    (mode: 'create' | 'update', id?: number) => {
      setModeClass(mode)
      setSelectedClassId(id ?? null)
      setOpenClass(true)
    },
    []
  )

  // ---------------- Maint Cause ----------------

  const {
    rows: causeRows,
    loading: loadingCause,
    handleDelete: handleDeleteCause,
    handleFormSuccess: handleCauseSuccess,
    handleRefresh: refreshCause,
  } = useDataGrid(
    tblMaintCause.getAll,
    tblMaintCause.deleteById,
    'maintCauseId'
  )

  const causeColumns: GridColDef<TypeTblMaintCause>[] = [
    { field: 'descr', headerName: 'Description', flex: 1 },
    { field: 'orderNo', headerName: 'Order No', width: 100 },
    dataGridActionColumn({
      onEdit: row => openCauseForm('update', row.maintCauseId),
      onDelete: handleDeleteCause,
    }),
  ]

  const [openCause, setOpenCause] = useState(false)
  const [modeCause, setModeCause] = useState<'create' | 'update'>('create')
  const [selectedCauseId, setSelectedCauseId] = useState<number | null>(null)

  const openCauseForm = useCallback(
    (mode: 'create' | 'update', id?: number) => {
      setModeCause(mode)
      setSelectedCauseId(id ?? null)
      setOpenCause(true)
    },
    []
  )

  return (
    <>
      <Splitter initialPrimarySize='34%'>
        <CustomizedDataGrid
          label='Maint Class'
          showToolbar
          rows={classRows}
          columns={classColumns}
          loading={loadingClass}
          onAddClick={() => openClassForm('create')}
          onRefreshClick={refreshClass}
          getRowId={row => row.maintClassId}
        />

        <Splitter initialPrimarySize='50%'>
          <CustomizedDataGrid
            label='Maint Type'
            showToolbar
            rows={typeRows}
            columns={typeColumns}
            loading={loadingType}
            onAddClick={() => openTypeForm('create')}
            onRefreshClick={refreshType}
            getRowId={row => row.maintTypeId}
          />

          <CustomizedDataGrid
            label='Maint Cause'
            showToolbar
            rows={causeRows}
            columns={causeColumns}
            loading={loadingCause}
            onAddClick={() => openCauseForm('create')}
            onRefreshClick={refreshCause}
            getRowId={row => row.maintCauseId}
          />
        </Splitter>
      </Splitter>

      <MaintTypeFormDialog
        open={openType}
        mode={modeType}
        recordId={selectedTypeId}
        onClose={() => setOpenType(false)}
        onSuccess={handleTypeSuccess}
      />

      <MaintClassFormDialog
        open={openClass}
        mode={modeClass}
        recordId={selectedClassId}
        onClose={() => setOpenClass(false)}
        onSuccess={handleClassSuccess}
      />

      <MaintCauseFormDialog
        open={openCause}
        mode={modeCause}
        recordId={selectedCauseId}
        onClose={() => setOpenCause(false)}
        onSuccess={handleCauseSuccess}
      />
    </>
  )
}
