import ComponentTypeFormDialog from "./ComponentTypeFormDialog";
import TabsComponent from "./ComponentTypeTabs";
import Splitter from "@/shared/components/Splitter";
import CustomizedDataGrid from "@/shared/components/dataGrid/DataGrid";
import { useCallback, useMemo, useState } from "react";
import { useDataGrid } from "@/pages/general/_hooks/useDataGrid";
import { dataGridActionColumn } from "@/shared/components/dataGrid/DataGridActionsColumn";
import { tblCompType, TypeTblCompType } from "@/core/api/generated/api";
import { type GridColDef } from "@mui/x-data-grid";

export default function ComponentType() {
  const [selectedRowId, setSelectedRowId] = useState<null | number>(null);
  const [selectedCompTypeId, setSelectedCompTypeId] = useState<number | null>(
    null
  );
  const [openForm, setOpenForm] = useState(false);
  const [mode, setMode] = useState<"create" | "update">("create");

  const getAll = useCallback(() => {
    return tblCompType.getAll({
      include: {
        tblAddress: true,
      },
    });
  }, []);

  const { rows, loading, fetchData, handleDelete, handleFormSuccess } =
    useDataGrid(getAll, tblCompType.deleteById, "compTypeId");

  const handleCreate = useCallback(() => {
    setSelectedRowId(null);
    setMode("create");
    setOpenForm(true);
  }, []);

  const handleEdit = useCallback((row: TypeTblCompType) => {
    setSelectedRowId(row.compTypeId);
    setMode("update");
    setOpenForm(true);
  }, []);

  const columns = useMemo<GridColDef<TypeTblCompType>[]>(
    () => [
      { field: "compTypeNo", headerName: "CompTypeNo", flex: 1 },
      { field: "compName", headerName: "CompTypeName", flex: 1 },
      { field: "model", headerName: "Model", flex: 1 },
      {
        field: "maker",
        headerName: "Maker",
        flex: 1,
        valueGetter: (value, row) => row.tblAddress?.name,
      },
      dataGridActionColumn({ onEdit: handleEdit, onDelete: handleDelete }),
    ],
    [handleEdit, handleDelete]
  );

  return (
    <>
      <Splitter horizontal>
        <CustomizedDataGrid
          label="Component Type"
          showToolbar
          onAddClick={handleCreate}
          onRefreshClick={fetchData}
          rows={rows}
          columns={columns}
          loading={loading}
          getRowId={(row) => row.compTypeId}
          disableDensity
          disableRowNumber
          onRowClick={(params) => setSelectedCompTypeId(params.row.compTypeId)}
        />

        <TabsComponent selectedCompTypeId={selectedCompTypeId} />
      </Splitter>

      <ComponentTypeFormDialog
        open={openForm}
        mode={mode}
        recordId={selectedRowId}
        onClose={() => setOpenForm(false)}
        onSuccess={(record) => {
          handleFormSuccess(record);
          setOpenForm(false);
        }}
      />
    </>
  );
}
