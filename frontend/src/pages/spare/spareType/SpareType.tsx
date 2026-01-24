import Splitter from "@/shared/components/Splitter/Splitter";
import CustomizedDataGrid from "@/shared/components/dataGrid/DataGrid";
import StockTypeFormDialog from "./SpareTypeUpsert";
import { useState, useCallback } from "react";
import { GridColDef } from "@mui/x-data-grid";
import { useDataTree } from "@/shared/hooks/useDataTree";
import { mapToTree } from "@/shared/components/tree/TreeUtil";
import { GenericTree } from "@/shared/components/tree/Tree";
import { tblSpareType, TypeTblSpareType } from "@/core/api/generated/api";

const getRowId = (row: TypeTblSpareType) => row.spareTypeId;
const getItemName = (row: TypeTblSpareType) => row.name || "-";

// === Columns ===
const columns: GridColDef<TypeTblSpareType>[] = [
  { field: "no", headerName: "Number", width: 80 },
  { field: "name", headerName: "Name", flex: 1 },
  {
    field: "orderNo",
    headerName: "Order No",
    width: 80,
  },
];

export default function PageStockType() {
  const [openForm, setOpenForm] = useState(false);
  const [mode, setMode] = useState<"create" | "update">("create");
  const [selectedRowId, setSelectedRowId] = useState<number | null>(null);

  // === useDataTree ===
  const treeMapper = useCallback(
    (items: TypeTblSpareType[]) =>
      mapToTree(items, "spareTypeId", "parentSpareTypeId"),
    [],
  );

  const getAll = useCallback(() => tblSpareType.getAll(), []);

  const { tree, rows, loading, refetch, handleDelete } =
    useDataTree<TypeTblSpareType>({
      getAll,
      deleteById: tblSpareType.deleteById,
      getId: getRowId,
      mapper: treeMapper,
    });

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

  const handleUpsertClose = useCallback(() => {
    setOpenForm(false);
  }, []);

  const handleUpsertOpen = useCallback(() => {
    setOpenForm(true);
  }, []);

  return (
    <>
      <Splitter>
        {/* === TREE VIEW === */}
        <GenericTree<TypeTblSpareType>
          label="Tree View"
          loading={loading}
          data={tree}
          onDelete={handleDelete}
          onEdit={handleEdit}
          onDoubleClick={handleEdit}
          onAdd={handleCreate}
          onRefresh={refetch}
          getItemName={getItemName}
          getItemId={getRowId}
        />

        {/* === GRID VIEW === */}
        <CustomizedDataGrid
          showToolbar
          label="List View"
          loading={loading}
          rows={rows}
          columns={columns}
          onEditClick={handleEdit}
          onDeleteClick={handleDelete}
          onDoubleClick={handleEdit}
          onRefreshClick={refetch}
          onAddClick={handleCreate}
          getRowId={getRowId}
        />
      </Splitter>

      {/* === FORM === */}
      <StockTypeFormDialog
        open={openForm}
        mode={mode}
        recordId={selectedRowId}
        onClose={handleUpsertClose}
        onSuccess={refetch}
      />
    </>
  );
}
