import TabsComponent from "./FunctionTabs";
import CustomizedDataGrid from "@/shared/components/dataGrid/DataGrid";
import { tblFunctions, TypeTblFunctions } from "@/core/api/generated/api";
import { dataGridActionColumn } from "@/shared/components/dataGrid/DataGridActionsColumn";
import { useDataGrid } from "@/pages/general/_hooks/useDataGrid";
import { GridColDef } from "@mui/x-data-grid";
import { useCallback, useMemo, useState } from "react";
import Splitter from "@/shared/components/Splitter";

export default function FunctionListView() {
  const [selectedRowId, setSelectedRowId] = useState<null | number>(null);
  const [openForm, setOpenForm] = useState(false);
  const [mode, setMode] = useState<"create" | "update">("create");

  // === useDataGrid ===
  const { rows, loading, fetchData, handleDelete, handleFormSuccess } =
    useDataGrid(tblFunctions.getAll, tblFunctions.deleteById, "functionId");

  // === Handlers ===
  const handleCreate = useCallback(() => {
    setSelectedRowId(null);
    setMode("create");
    setOpenForm(true);
  }, []);

  const handleEdit = useCallback((row: TypeTblFunctions) => {
    setSelectedRowId(row.functionId);
    setMode("update");
    setOpenForm(true);
  }, []);

  // === Columns ===
  const columns = useMemo<GridColDef<TypeTblFunctions>[]>(
    () => [
      { field: "compId", headerName: "Comp Name", flex: 1 },
      { field: "compTypeId", headerName: "Comp Type", flex: 1 },
      { field: "funcNo", headerName: "Function No", flex: 1 },
      { field: "funcDescr", headerName: "Description", flex: 2 },
      { field: "statusId", headerName: "Status", flex: 1 },
      dataGridActionColumn({ onEdit: handleEdit, onDelete: handleDelete }),
    ],
    [handleEdit, handleDelete]
  );

  return (
    <>
      <Splitter horizontal>
        <TabsComponent />

        <CustomizedDataGrid
          label="Functions"
          showToolbar
          onAddClick={handleCreate}
          onRefreshClick={fetchData}
          rows={rows}
          columns={columns}
          loading={loading}
          getRowId={(row) => row.functionId}
          disableDensity
          disableRowNumber
          checkboxSelection
          disableMultipleRowSelection
        />
      </Splitter>
      {/* <FunctionFormDialog
        open={openForm}
        mode={mode}
        recordId={selectedRowId}
        onClose={() => setOpenForm(false)}
        onSuccess={(record) => {
          handleFormSuccess(record);
          setOpenForm(false);
        }}
      /> */}
    </>
  );
}
