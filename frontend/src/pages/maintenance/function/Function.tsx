import Splitter from "@/shared/components/Splitter/Splitter";
import CustomizedDataGrid from "@/shared/components/dataGrid/DataGrid";
import FunctionUpsert from "./FunctionUpsert";
import DialogInstallRemoveComponent from "./_components/DialogInstallRemoveComponent";
import { useRouter } from "@tanstack/react-router";
import { useDataTree } from "@/shared/hooks/useDataTree";
import { mapToTree } from "@/shared/components/tree/TreeUtil";
import { GenericTree } from "@/shared/components/tree/Tree";
import { GridColDef } from "@mui/x-data-grid";
import { useCallback, useState, useMemo } from "react";
import { tblFunctions, TypeTblFunctions } from "@/core/api/generated/api";
import { Box, Button } from "@mui/material";
import { Add, Remove } from "@mui/icons-material";
import { routeDetail } from "./FunctionRoutes";

const getRowId = (row: TypeTblFunctions) => row.functionId;
const getItemName = (row: TypeTblFunctions) => row.funcNo || "-";

const columns: GridColDef<TypeTblFunctions>[] = [
  { field: "funcNo", headerName: "Function No", flex: 1 },
  { field: "funcDesc", headerName: "Function Desc", flex: 1 },
  {
    field: "component",
    headerName: "Component",
    flex: 1,
    valueGetter: (_, row) => row.tblComponentUnit?.compNo,
  },
  { field: "orderNo", headerName: "Order No", width: 85 },
];

export default function PageFunction() {
  const router = useRouter();

  const [selectedRowId, setSelectedRowId] = useState<number | null>(null);
  const [openForm, setOpenForm] = useState(false);
  const [mode, setMode] = useState<"create" | "update">("create");

  const [componentDialog, setComponentDialog] = useState<{
    open: boolean;
    mode: "install" | "remove";
  } | null>(null);

  const getAll = useCallback(() => {
    return tblFunctions.getAll({
      include: {
        tblComponentUnit: true,
      },
    });
  }, []);

  // === tree mapper ===
  const treeMapper = useCallback(
    (items: TypeTblFunctions[]) =>
      mapToTree(items, "functionId", "parentFunctionId"),
    [],
  );

  const { rows, tree, loading, refetch, handleDelete } =
    useDataTree<TypeTblFunctions>({
      getAll,
      deleteById: tblFunctions.deleteById,
      getId: (item) => item.functionId,
      mapper: treeMapper,
    });

  const selectedRow = useMemo(() => {
    if (!selectedRowId) return null;
    return rows.find((r) => r.functionId === selectedRowId) || null;
  }, [selectedRowId, rows]);

  const handleRowClick = (params: any) => {
    setSelectedRowId(params.row.functionId);
  };

  const handleCreate = useCallback(() => {
    setSelectedRowId(null);
    setMode("create");
    setOpenForm(true);
  }, []);

  const handleEdit = useCallback((rowId: number) => {
    setSelectedRowId(rowId);
    setMode("update");
    setOpenForm(true);
  }, []);

  const handleUpsertClose = useCallback(() => {
    setOpenForm(false);
  }, []);

  const handleRowDoubleClick = useCallback(
    (rowId: number) => {
      const row = rows.find((i) => i.functionId === rowId);
      if (!row) return;

      router.navigate({
        to: routeDetail.to,
        params: { id: rowId },
        search: { breadcrumb: row?.funcNo },
      });
    },
    [router, rows],
  );

  return (
    <>
      <Splitter initialPrimarySize="35%">
        <GenericTree<TypeTblFunctions>
          loading={loading}
          data={tree}
          onDoubleClick={handleRowDoubleClick}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onAdd={handleCreate}
          getItemId={getRowId}
          getItemName={getItemName}
        />

        <CustomizedDataGrid
          showToolbar
          label="List View"
          rows={rows}
          columns={columns}
          loading={loading}
          getRowId={getRowId}
          onEditClick={handleEdit}
          onDeleteClick={handleDelete}
          onDoubleClick={handleRowDoubleClick}
          onAddClick={handleCreate}
          onRefreshClick={refetch}
          onRowClick={handleRowClick}
          toolbarChildren={
            <Box display={"flex"}>
              <Button
                disabled={!selectedRow || !!selectedRow?.compId}
                size="small"
                startIcon={<Add />}
                onClick={() =>
                  setComponentDialog({ open: true, mode: "install" })
                }
              >
                Install Component
              </Button>

              <Button
                color="error"
                size="small"
                startIcon={<Remove />}
                disabled={!selectedRow || !selectedRow?.compId}
                onClick={() =>
                  setComponentDialog({ open: true, mode: "remove" })
                }
              >
                Remove Component
              </Button>
            </Box>
          }
        />
      </Splitter>

      <FunctionUpsert
        open={openForm}
        mode={mode}
        recordId={selectedRowId}
        onClose={handleUpsertClose}
        onSuccess={refetch}
      />

      {componentDialog && selectedRow && (
        <DialogInstallRemoveComponent
          open={componentDialog.open}
          mode={componentDialog.mode}
          functionId={selectedRow.functionId}
          compId={selectedRow.compId}
          onClose={() => setComponentDialog(null)}
          onSuccess={refetch}
        />
      )}
    </>
  );
}
