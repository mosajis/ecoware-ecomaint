import { useMemo, useCallback } from 'react'
import CustomizedDataGrid from '@/shared/components/dataGrid/DataGrid'
import { useDataGrid } from '@/shared/hooks/useDataGrid'
import { GridColDef } from '@mui/x-data-grid'
import {
  tblCompJob,
  tblJobDescription,
  tblRound,
  TypeTblCompJob,
  TypeTblComponentUnit,
  TypeTblJobDescription,
} from '@/core/api/generated/api'

interface TabJobProps {
  componentUnit?: TypeTblComponentUnit | null
  label?: string | null
}

const TabJob = ({ componentUnit, label }: TabJobProps) => {
  // const [openForm, setOpenForm] = useState(false);
  // const [selectedRowId, setSelectedRowId] = useState<number | null>(null);

  const getAll = useCallback(() => {
    return tblCompJob.getAll({
      filter: {
        compId: componentUnit?.compId,
      },
      include: {
        tblJobDescription: true,
        tblDiscipline: true,
        tblPeriod: true,
      },
    })
  }, [componentUnit?.compId])
  // --- useDataGrid ---
  const { rows, loading, handleRefresh, handleDelete, handleFormSuccess } =
    useDataGrid(
      getAll,
      tblJobDescription.deleteById,
      'jobDescId',
      !!componentUnit?.compId
    )

  // --- Handlers ---
  const handleAdd = useCallback(() => {
    // setSelectedRowId(null);
    // setOpenForm(true);
  }, [])

  const handleEdit = useCallback((row: TypeTblJobDescription) => {
    // setSelectedRowId(row.jobDescriptionId);
    // setOpenForm(true);
  }, [])

  // --- Columns ---
  const columns = useMemo<GridColDef<TypeTblCompJob>[]>(
    () => [
      {
        field: 'jobDescCode',
        headerName: 'Code',
        width: 100,
        valueGetter: (_, row) => row.tblJobDescription?.jobDescCode,
      },
      {
        field: 'jobDescTitle',
        headerName: 'Job Title',
        flex: 1,
        valueGetter: (_, row) => row.tblJobDescription?.jobDescTitle,
      },
      {
        field: 'discipline',
        headerName: 'Discipline (not set)',
        flex: 1,
        valueGetter: (_, row) => row.tblDiscipline?.name,
      },
      { field: 'frequency', headerName: 'Frequency', width: 120 },
      {
        field: 'tblPeriod',
        headerName: 'Frequency Period',
        width: 150,
        valueGetter: (_, row) => row.tblPeriod?.name,
      },
      { field: 'lastDone', headerName: 'Last Done', width: 150 },
      {
        field: 'nextDueDate',
        headerName: 'Next DueDate',
        width: 150,
      },
      // { field: 'round', headerName: 'Round (not set)', width: 150,  valueGetter: (_, row) => row.tbl?.name,},
      // { field: 'roundTitle', headerName: 'Round Title (not set)', width: 150 },
    ],
    [handleEdit, handleDelete]
  )

  return (
    <>
      <CustomizedDataGrid
        label={label ?? 'Job List'}
        showToolbar
        rows={rows}
        columns={columns}
        disableRowNumber
        loading={loading}
        onRefreshClick={handleRefresh}
        onAddClick={handleAdd}
        getRowId={row => row.jobDescId}
      />
    </>
  )
}

export default TabJob
