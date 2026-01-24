import CustomizedDataGrid from "@/shared/components/dataGrid/DataGrid";
import StockItemFormDialog from "./SpareUnitUpsert";
import { useState, useCallback } from "react";
import { GridColDef } from "@mui/x-data-grid";
import { useDataGrid } from "@/shared/hooks/useDataGrid";
import { tblSpareUnit, TypeTblSpareUnit } from "@/core/api/generated/api";

const getRowId = (row: TypeTblSpareUnit) => row.spareUnitId;

const columns: GridColDef<TypeTblSpareUnit>[] = [
  {
    field: "number",
    headerName: "Number",
    valueGetter: (_, row) => row.tblSpareType?.no,
  },
  {
    field: "tblSpareType",
    headerName: "Stock Type",
    flex: 1,
    valueGetter: (_, row) => row.tblSpareType?.name,
  },
];

export default function PageStockItem() {
  const [openForm, setOpenForm] = useState(false);
  const [mode, setMode] = useState<"create" | "update">("create");
  const [selectedRowId, setSelectedRowId] = useState<number | null>(null);

  const getAll = useCallback(() => {
    return tblSpareUnit.getAll({
      include: {
        tblSpareType: true,
      },
    });
  }, []);

  // === useDataTree ===
  const { rows, loading, handleDelete, handleRefresh } = useDataGrid(
    getAll,
    tblSpareUnit.deleteById,
    "spareUnitId",
  );

  // === Handlers ===
  const handleCreate = () => {
    setSelectedRowId(null);
    setMode("create");
    handleUpsertOpen();
  };

  const handleEdit = (rowId: number) => {
    setSelectedRowId(rowId);
    setMode("update");
    handleUpsertOpen();
  };

  // === Columns ===

  const handleUpsertClose = useCallback(() => {
    setOpenForm(false);
  }, []);

  const handleUpsertOpen = useCallback(() => {
    setOpenForm(true);
  }, []);
  return (
    <>
      <CustomizedDataGrid
        showToolbar
        label="List View"
        loading={loading}
        rows={rows}
        columns={columns}
        onEditClick={handleEdit}
        onDoubleClick={handleEdit}
        onDeleteClick={handleDelete}
        onRefreshClick={handleRefresh}
        onAddClick={handleCreate}
        getRowId={getRowId}
      />

      <StockItemFormDialog
        open={openForm}
        mode={mode}
        recordId={selectedRowId}
        onClose={handleUpsertClose}
        onSuccess={handleRefresh}
      />
    </>
  );
}
