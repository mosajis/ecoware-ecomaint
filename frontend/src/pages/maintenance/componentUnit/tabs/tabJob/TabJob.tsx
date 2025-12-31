import { useMemo, useCallback } from 'react'
import CustomizedDataGrid from '@/shared/components/dataGrid/DataGrid'
import { useDataGrid } from '@/shared/hooks/useDataGrid'
import { GridColDef } from '@mui/x-data-grid'
import {
  tblCompJob,
  tblJobDescription,
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
      include: {
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
  const columns = useMemo<GridColDef<TypeTblJobDescription>[]>(
    () => [
      { field: 'jobDescCode', headerName: 'Code', width: 100 },
      { field: 'jobDescTitle', headerName: 'Job Title', flex: 1 },
      {
        field: 'discipline',
        headerName: 'Discipline (not set)',
        flex: 1,
        // valueGetter: (_, row) => row.tbl?.name ?? "",
      },
      { field: 'frequency', headerName: 'Frequency (not set)', width: 120 },
      {
        field: 'tblPeriod',
        headerName: 'Frequency Period',
        width: 150,
        // valueGetter: (_, row) => row.tblPeriod?.name ?? '',
      },
      { field: 'lastDone', headerName: 'Last Done (not set)', width: 150 },
      {
        field: 'nextDueDate',
        headerName: 'Next Due Date (not set)',
        width: 150,
      },
      { field: 'round', headerName: 'Round (not set)', width: 150 },
      { field: 'roundTitle', headerName: 'Round Title (not set)', width: 150 },
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
        loading={loading}
        onRefreshClick={handleRefresh}
        onAddClick={handleAdd}
        getRowId={row => row.jobDescId}
      />
    </>
  )
}

export default TabJob
