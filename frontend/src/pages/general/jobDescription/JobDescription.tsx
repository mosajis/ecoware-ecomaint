import Splitter from "@/shared/components/Splitter/Splitter";
import JobDescriptionUpsert from "./JobDescriptionUpsert";
import CustomizedDataGrid from "@/shared/components/dataGrid/DataGrid";
import { GridColDef } from "@mui/x-data-grid";
import { useCallback, useState } from "react";
import { Tabs } from "./JobDescriptionTabs";
import { useDataGrid } from "@/shared/hooks/useDataGrid";
import {
  tblJobDescription,
  TypeTblJobDescription,
} from "@/core/api/generated/api";

const getRowId = (row: TypeTblJobDescription) => row.jobDescId;

// === Columns ===
const columns: GridColDef<TypeTblJobDescription>[] = [
  { field: "jobDescCode", headerName: "Code", width: 120 },
  { field: "jobDescTitle", headerName: "JobTitle", flex: 2 },
  {
    field: "jobClass",
    headerName: "JobClass",
    flex: 1,
    valueGetter: (value, row) => row?.tblJobClass?.name,
  },
  { field: "changeReason", headerName: "ChangeReason", flex: 1 },
];

export default function PageJobDescription() {
  const [openForm, setOpenForm] = useState(false);
  const [mode, setMode] = useState<"create" | "update">("create");
  const [selectedRowId, setSelectedRowId] = useState<number | null>(null);
  const [label, setLabel] = useState<string | null>(null);

  // === DataGrid ===
  const getAll = useCallback(() => {
    return tblJobDescription.getAll({
      include: { tblJobClass: true },
    });
  }, []);

  const { rows, loading, handleRefresh, handleDelete } = useDataGrid(
    getAll,
    tblJobDescription.deleteById,
    "jobDescId",
  );

  // === Handlers ===
  const handleCreate = useCallback(() => {
    setSelectedRowId(null);
    setMode("create");
    handleUpsertOpen();
  }, []);

  const handleEdit = useCallback((rowId: number) => {
    setSelectedRowId(rowId);
    setMode("update");
    handleUpsertOpen();
  }, []);

  const handleUpsertClose = useCallback(() => {
    setOpenForm(false);
  }, []);

  const handleUpsertOpen = useCallback(() => {
    setOpenForm(true);
  }, []);

  const handleRowClick = useCallback(
    ({ row }: { row: TypeTblJobDescription }) => {
      setSelectedRowId(row.jobDescId);
      setLabel(row.jobDescTitle);
    },
    [],
  );

  return (
    <>
      <Splitter initialPrimarySize="45%" resetOnDoubleClick>
        <CustomizedDataGrid
          showToolbar
          disableRowNumber
          disableRefresh
          disableColumns
          label="Job Description"
          loading={loading}
          rows={rows}
          columns={columns}
          onAddClick={handleCreate}
          onRefreshClick={handleRefresh}
          onDoubleClick={handleEdit}
          onEditClick={handleEdit}
          onDeleteClick={handleDelete}
          onRowClick={handleRowClick}
          getRowId={getRowId}
        />

        <Tabs label={label} jobDescriptionId={selectedRowId} />
      </Splitter>

      <JobDescriptionUpsert
        open={openForm}
        mode={mode}
        recordId={selectedRowId}
        onClose={handleUpsertClose}
        onSuccess={handleRefresh}
      />
    </>
  );
}
