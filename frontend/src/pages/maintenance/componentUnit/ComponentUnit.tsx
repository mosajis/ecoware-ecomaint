import TabsComponent from "./ComponentUnitTabs";
import Splitter from "@/shared/components/Splitter";
import CustomizedDataGrid from "@/shared/components/dataGrid/DataGrid";
import { useCallback, useMemo, useState } from "react";
import {
  tblComponentUnit,
  TypeTblComponentUnit,
} from "@/core/api/generated/api";
import { GridColDef } from "@mui/x-data-grid";
import { dataGridActionColumn } from "@/shared/components/dataGrid/DataGridActionsColumn";
import { useDataGrid } from "@/pages/general/_hooks/useDataGrid";

export default function ComponentUnitListView() {
  const [selectedRowId, setSelectedRowId] = useState<null | number>(null);
  const [openForm, setOpenForm] = useState(false);
  const [mode, setMode] = useState<"create" | "update">("create");

  // === API CALL ===
  const getAll = useCallback(() => {
    return tblComponentUnit.getAll({ paginate: false });
  }, []);

  // === useDataGrid HOOK ===
  const { rows, loading, fetchData, handleDelete, handleFormSuccess } =
    useDataGrid(getAll, tblComponentUnit.deleteById, "compId");

  // === Handlers ===
  const handleCreate = useCallback(() => {
    setSelectedRowId(null);
    setMode("create");
    setOpenForm(true);
  }, []);

  const handleEdit = useCallback((row: TypeTblComponentUnit) => {
    setSelectedRowId(row.compId);
    setMode("update");
    setOpenForm(true);
  }, []);

  // === Columns ===
  const columns = useMemo<GridColDef[]>(
    () => [
      { field: "compId", headerName: "Comp Name", flex: 1 },
      { field: "compTypeId", headerName: "Comp Type", flex: 1 },
      { field: "model", headerName: "Model", flex: 1 },
      { field: "serialNo", headerName: "Serial No", flex: 1 },
      { field: "comment1", headerName: "Comment 1", flex: 1 },
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
          label="Component Unit"
          showToolbar
          onAddClick={handleCreate}
          onRefreshClick={fetchData}
          disableDensity
          disableRowNumber
          rows={rows}
          columns={columns}
          loading={loading}
          getRowId={(row) => row.compId}
        />
      </Splitter>
      {/* <ComponentUnitFormDialog
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
