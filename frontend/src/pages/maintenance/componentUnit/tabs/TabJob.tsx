import { useMemo, useState, useCallback } from "react";
import CustomizedDataGrid from "@/shared/components/dataGrid/DataGrid";
import { useDataGrid } from "@/shared/hooks/useDataGrid";
import { GridColDef } from "@mui/x-data-grid";
import { dataGridActionColumn } from "@/shared/components/dataGrid/DataGridActionsColumn";
import {
  tblJobDescription,
  TypeTblJobDescription,
} from "@/core/api/generated/api";

interface TabJobProps {
  compUnitId?: number | null;
  label?: string | null;
}

const TabJob = ({ compUnitId, label }: TabJobProps) => {
  // const [openForm, setOpenForm] = useState(false);
  // const [selectedRowId, setSelectedRowId] = useState<number | null>(null);

  // --- useDataGrid ---
  const { rows, loading, handleRefresh, handleDelete, handleFormSuccess } =
    useDataGrid(
      tblJobDescription.getAll,
      tblJobDescription.deleteById,
      "jobDescId",
      !!compUnitId
    );

  // --- Handlers ---
  const handleAdd = useCallback(() => {
    // setSelectedRowId(null);
    // setOpenForm(true);
  }, []);

  const handleEdit = useCallback((row: TypeTblJobDescription) => {
    // setSelectedRowId(row.jobDescriptionId);
    // setOpenForm(true);
  }, []);

  // --- Columns ---
  const columns = useMemo<GridColDef<TypeTblJobDescription>[]>(
    () => [
      { field: "jobDescCode", headerName: "Code", width: 100 },
      { field: "jobDescTitle", headerName: "Job Title", flex: 1 },
      {
        field: "discipline",
        headerName: "Discipline",
        flex: 1,
        // valueGetter: (_, row) => row.discipline?.name ?? "",
      },
      { field: "frequency", headerName: "Frequency", width: 120 },
      {
        field: "tblPeriod",
        headerName: "Frequency Period",
        width: 150,
        // valueGetter: (_, row) => row.tblPeriod?.name ?? "",
      },
      { field: "lastDone", headerName: "Last Done", width: 150 },
      { field: "nextDueDate", headerName: "Next Due Date", width: 150 },
      { field: "round", headerName: "Round", width: 150 },
      { field: "roundTitle", headerName: "Round Title", width: 150 },
    ],
    [handleEdit, handleDelete]
  );

  return (
    <>
      <CustomizedDataGrid
        label={label ?? "Job List"}
        showToolbar
        rows={rows}
        columns={columns}
        loading={loading}
        onRefreshClick={handleRefresh}
        onAddClick={handleAdd}
        getRowId={(row) => row.jobDescId}
      />
    </>
  );
};

export default TabJob;
