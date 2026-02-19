import CustomizedDataGrid from "@/shared/components/dataGrid/DataGrid";
import TabComponentUpsert from "./TabComponentUnitUpsert";
import { useState, useCallback } from "react";
import { GridColDef } from "@mui/x-data-grid";
import { useDataGrid } from "@/shared/hooks/useDataGrid";
import {
  tblCompType,
  tblWorkShopComponent,
  TypeTblWorkShopComponent,
} from "@/core/api/generated/api";

const getRowId = (row: TypeTblWorkShopComponent) => row.workShopCompId;

const columns: GridColDef<TypeTblWorkShopComponent>[] = [
  {
    field: "compNo",
    headerName: "Component No",
    width: 280,
    //@ts-ignore
    valueGetter: (_, row) => row?.tblComponentUnit?.compNo ?? "",
  },
  {
    field: "compType",
    headerName: "Component Type",
    flex: 1,
    //@ts-ignore
    valueGetter: (_, row) => row?.tblComponentUnit?.tblCompType?.compName ?? "",
  },
  {
    field: "model",
    headerName: "Model / Type",
    flex: 1,
    valueGetter: (_, row) => row?.tblComponentUnit?.model ?? "",
  },
  {
    field: "locationId",
    headerName: "Location",
    flex: 1,
    //@ts-ignore
    valueGetter: (_, row) => row?.tblLocation?.name ?? "",
  },
  {
    field: "serialNo",
    headerName: "Serial No",
    flex: 1,
    valueGetter: (_, row) => row?.tblComponentUnit?.serialNo ?? "",
  },
];

type Props = {
  workShopId?: number | null;
};

export default function TabComponents({ workShopId }: Props) {
  const [openForm, setOpenForm] = useState(false);
  const [mode, setMode] = useState<"create" | "update">("create");
  const [selectedRowId, setSelectedRowId] = useState<number | null>(null);

  const handleCreate = () => {
    if (!workShopId) return;
    setSelectedRowId(null);
    setMode("create");
    setOpenForm(true);
  };

  const handleEdit = (row: TypeTblWorkShopComponent) => {
    setSelectedRowId(row.workShopCompId);
    setMode("update");
    setOpenForm(true);
  };

  const getAll = useCallback(() => {
    return tblWorkShopComponent.getAll({
      filter: { workShopId },
      include: {
        tblComponentUnit: {
          include: {
            tblCompType: true,
          },
        },
        tblLocation: true,
      },
    });
  }, [workShopId]);

  const { rows, loading, handleRefresh, handleDelete } = useDataGrid(
    getAll,
    tblWorkShopComponent.deleteById,
    "workShopCompId",
    !!workShopId,
  );

  const handleFormSuccess = () => {
    setOpenForm(false);
    handleRefresh();
  };

  return (
    <>
      <CustomizedDataGrid
        showToolbar
        disableEdit={true}
        label="Component Units"
        loading={loading}
        rows={rows}
        columns={columns}
        getRowId={getRowId}
        onDeleteClick={handleDelete}
        onRefreshClick={handleRefresh}
        onAddClick={handleCreate}
        onRowDoubleClick={({ row }) => handleEdit(row)}
      />

      {workShopId && (
        <TabComponentUpsert
          open={openForm}
          workShopId={workShopId}
          onClose={() => setOpenForm(false)}
          onSuccess={handleFormSuccess}
        />
      )}
    </>
  );
}
