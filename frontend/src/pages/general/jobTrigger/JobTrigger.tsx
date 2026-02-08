import CustomizedDataGrid from "@/shared/components/dataGrid/DataGrid";
import Upsert from "./JobTriggerUpsert";
import Splitter from "@/shared/components/Splitter/Splitter";
import { type GridColDef } from "@mui/x-data-grid";
import { useCallback, useState } from "react";
import { useDataGrid } from "@/shared/hooks/useDataGrid";
import { tblJobTrigger, TypeTblJobTrigger } from "@/core/api/generated/api";
import { Tabs } from "./JobTriggerTabs";

const getRowId = (row: TypeTblJobTrigger) => row.jobTriggerId;

const columns: GridColDef<TypeTblJobTrigger>[] = [
  { field: "descr", headerName: "Description", flex: 1 },
  { field: "orderNo", headerName: "Order No", width: 100 },
];

export default function PageJobTrigger() {
  const [selectedRowId, setSelectedRowId] = useState<null | number>(null);
  const [openForm, setOpenForm] = useState(false);
  const [mode, setMode] = useState<"create" | "update">("create");
  const [label, setLabel] = useState<string | null>(null);

  // === useDataGrid ===
  const { rows, loading, handleDelete, handleRefresh } = useDataGrid(
    tblJobTrigger.getAll,
    tblJobTrigger.deleteById,
    "jobTriggerId",
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

  const handleRowClick = useCallback(({ row }: { row: TypeTblJobTrigger }) => {
    setSelectedRowId(row.jobTriggerId);
    setLabel(row.descr);
  }, []);
  return (
    <>
      <Splitter initialPrimarySize="35%" resetOnDoubleClick>
        <CustomizedDataGrid
          showToolbar
          disableRowNumber
          disableRefresh
          disableFilters
          label="Job Triggers"
          rows={rows}
          columns={columns}
          loading={loading}
          onAddClick={handleCreate}
          onRefreshClick={handleRefresh}
          onDeleteClick={handleDelete}
          onEditClick={handleEdit}
          onDoubleClick={handleEdit}
          onRowClick={handleRowClick}
          getRowId={getRowId}
        />
        <Tabs label={label} jobTriggerId={selectedRowId} />
      </Splitter>

      <Upsert
        open={openForm}
        mode={mode}
        recordId={selectedRowId}
        onClose={handleUpsertClose}
        onSuccess={handleRefresh}
      />
    </>
  );
}
