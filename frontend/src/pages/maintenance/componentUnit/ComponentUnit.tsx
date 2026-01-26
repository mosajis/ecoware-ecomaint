import Splitter from "@/shared/components/Splitter/Splitter";
import CustomizedDataGrid from "@/shared/components/dataGrid/DataGrid";
import ComponentUnitUpsert from "./ComponentUnitUpsert";
import { useRouter } from "@tanstack/react-router";
import { routeComponentUnitDetail } from "./ComponentUnitRoutes";
import { useDataTree } from "@/shared/hooks/useDataTree";
import { mapToTree } from "@/shared/components/tree/TreeUtil";
import { GenericTree } from "@/shared/components/tree/Tree";
import { GridColDef } from "@mui/x-data-grid";
import { useCallback, useState } from "react";
import {
  tblComponentUnit,
  TypeTblComponentUnit,
} from "@/core/api/generated/api";

const getRowId = (row: TypeTblComponentUnit) => row.compId;
const getItemName = (row: TypeTblComponentUnit) => row.compNo || "-";

const columns: GridColDef<TypeTblComponentUnit>[] = [
  { field: "compNo", headerName: "Component No", width: 280 },
  {
    field: "compType",
    headerName: "Component Type",
    flex: 1,
    valueGetter: (_, row) => row.tblCompType?.compType ?? "",
  },
  { field: "model", headerName: "Model / Type", flex: 1 },
  {
    field: "locationId",
    headerName: "Location",
    flex: 1,
    valueGetter: (_, row) => row.tblLocation?.name ?? "",
  },
  { field: "serialNo", headerName: "Serial No", flex: 1 },
  {
    field: "statusId",
    headerName: "Status",
    width: 120,
    valueGetter: (_, row) => row.tblCompStatus?.compStatusName ?? "",
  },
  { field: "orderNo", headerName: "Order No", width: 85 },
];

export default function PageComponentUnit() {
  const router = useRouter();

  const [selectedRowId, setSelectedRowId] = useState<null | number>(null);
  const [openForm, setOpenForm] = useState(false);
  const [mode, setMode] = useState<"create" | "update">("create");

  const getAll = useCallback(() => {
    return tblComponentUnit.getAll({
      include: {
        tblCompType: true,
        tblCompStatus: true,
        tblLocation: true,
      },
    });
  }, []);

  const treeMapper = useCallback(
    (items: TypeTblComponentUnit[]) =>
      mapToTree(items, "compId", "parentCompId"),
    [],
  );

  const { rows, tree, loading, refetch, handleDelete } =
    useDataTree<TypeTblComponentUnit>({
      getAll,
      deleteById: tblComponentUnit.deleteById,
      getId: (item) => item.compId,
      mapper: treeMapper,
    });

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

  const handleRowDoubleClick = useCallback(
    (rowId: number) => {
      const row = rows.find((i) => i.compId === rowId);

      if (!row) return;
      router.navigate({
        to: routeComponentUnitDetail.to,
        params: { id: rowId },
        search: { breadcrumb: row?.compNo },
      });
    },
    [router, rows],
  );

  return (
    <>
      <Splitter initialPrimarySize="30%">
        <GenericTree<TypeTblComponentUnit>
          label="Tree View"
          loading={loading}
          data={tree}
          onDoubleClick={handleRowDoubleClick}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onAdd={handleCreate}
          onRefresh={refetch}
          getItemId={getRowId}
          getItemName={getItemName}
        />
        <CustomizedDataGrid
          showToolbar
          disableRowNumber
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
        />
      </Splitter>

      <ComponentUnitUpsert
        open={openForm}
        mode={mode}
        recordId={selectedRowId}
        onClose={handleUpsertClose}
        onSuccess={refetch}
      />
    </>
  );
}
