import Splitter from "@/shared/components/Splitter";
import TabsComponent from "./FunctionTabs";
import CustomizedDataGrid from "@/shared/components/dataGrid/DataGrid";
import { tblFunctions, TypeTblFunctions } from "@/core/api/generated/api";
import { dataGridActionColumn } from "@/shared/components/dataGrid/DataGridActionsColumn";
import { GridColDef } from "@mui/x-data-grid";
import { useCallback, useMemo, useState } from "react";
import FunctionFormDialog from "./FunctionFormDialog";
import { useDataGrid } from "@/shared/hooks/useDataGrid";

export default function PageFunction() {
  const [selectedRowId, setSelectedRowId] = useState<null | number>(null);
  const [openForm, setOpenForm] = useState(false);
  const [mode, setMode] = useState<"create" | "update">("create");

  const getAll = useCallback(
    () =>
      tblFunctions.getAll({
        include: {
          tblComponentUnit: true,
        },
      }),
    []
  );
  // === useDataGrid ===
  const { rows, loading, handleRefresh, handleDelete, handleFormSuccess } =
    useDataGrid(getAll, tblFunctions.deleteById, "functionId");

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
      { field: "funcNo", headerName: "Function No", flex: 1 },
      { field: "funcDescr", headerName: "Function Descr", flex: 1 },
      { field: "funcRef", headerName: "Function Ref", flex: 1 },
      {
        field: "component",
        headerName: "Component",
        flex: 1,
        valueGetter: (_, row) => row.tblComponentUnit?.compNo,
      },
      dataGridActionColumn({ onEdit: handleEdit, onDelete: handleDelete }),
    ],
    [handleEdit, handleDelete]
  );

  return (
    <>
      <Splitter horizontal>
        <CustomizedDataGrid
          label="Functions"
          showToolbar
          onAddClick={handleCreate}
          onRefreshClick={handleRefresh}
          rows={rows}
          columns={columns}
          loading={loading}
          getRowId={(row) => row.functionId}
        />
        <TabsComponent />
      </Splitter>
      <FunctionFormDialog
        open={openForm}
        mode={mode}
        recordId={selectedRowId}
        onClose={() => setOpenForm(false)}
        onSuccess={(record) => handleRefresh()}
      />
    </>
  );
}
