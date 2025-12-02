import Splitter from "@/shared/components/Splitter";
import CounterTypeFormDialog from "./CounterTypeFormDialog";
import CustomizedDataGrid from "@/shared/components/dataGrid/DataGrid";
import CounterTypeTabs from "./CounterTypeTabs";
import { useState, useCallback } from "react";
import { dataGridActionColumn } from "@/shared/components/dataGrid/DataGridActionsColumn";
import { useDataGrid } from "../_hooks/useDataGrid";
import { tblCounterType, TypeTblCounterType } from "@/core/api/generated/api";

export default function PageCounterType() {
  const [openForm, setOpenForm] = useState(false);
  const [mode, setMode] = useState<"create" | "update">("create");
  const [selectedRowId, setSelectedRowId] = useState<number | null>(null);
  const [selected, setSelected] = useState<TypeTblCounterType | null>(null);

  const {
    rows: counterTypes,
    loading: loadingCounterTypes,
    fetchData: fetchCounterTypes,
    handleDelete: deleteCounterType,
    handleFormSuccess: counterTypeFormSuccess,
    handleRefresh,
  } = useDataGrid(
    tblCounterType.getAll,
    tblCounterType.deleteById,
    "counterTypeId"
  );

  // Handlers
  const handleCreate = useCallback(() => {
    setSelectedRowId(null);
    setMode("create");
    setOpenForm(true);
  }, []);

  const handleEdit = useCallback((row: TypeTblCounterType) => {
    setSelectedRowId(row.counterTypeId);
    setMode("update");
    setOpenForm(true);
  }, []);

  return (
    <>
      <Splitter initialPrimarySize="30%">
        {/* Left Grid */}
        <CustomizedDataGrid
          rows={counterTypes}
          columns={[
            { field: "name", headerName: "Name", flex: 1 },
            dataGridActionColumn({
              onEdit: handleEdit,
              onDelete: deleteCounterType,
            }),
          ]}
          loading={loadingCounterTypes}
          label="Counter Type"
          showToolbar
          disableDensity
          disableColumns
          disableExport
          onAddClick={handleCreate}
          onRefreshClick={handleRefresh}
          getRowId={(row) => row.counterTypeId}
          rowSelection
          onRowClick={(params) => setSelected(params.row)}
        />

        <CounterTypeTabs
          counterTypeId={selected?.counterTypeId}
          label={selected?.name}
        />
      </Splitter>
      <CounterTypeFormDialog
        open={openForm}
        mode={mode}
        recordId={selectedRowId}
        onClose={() => setOpenForm(false)}
        onSuccess={(record) => {
          counterTypeFormSuccess(record);
          setOpenForm(false);
        }}
      />
    </>
  );
}
