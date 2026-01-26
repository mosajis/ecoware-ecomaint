import CustomizedDataGrid from "@/shared/components/dataGrid/DataGrid";
import MeasurePointUpsert from "./TabMeasuresUpsert";
import { useCallback, useState } from "react";
import { GridColDef } from "@mui/x-data-grid";
import { useDataGrid } from "@/shared/hooks/useDataGrid";
import {
  tblCompTypeMeasurePoint,
  TypeTblCompType,
  TypeTblCompTypeMeasurePoint,
} from "@/core/api/generated/api";

type Props = {
  compType?: TypeTblCompType | null;
  label?: string;
};

const getRowId = (row: TypeTblCompTypeMeasurePoint) =>
  row.compTypeMeasurePointId;

// === Columns ===
const columns: GridColDef<TypeTblCompTypeMeasurePoint>[] = [
  {
    field: "measureName",
    headerName: "Measure",
    flex: 1,
    valueGetter: (_, row) => row.tblCounterType?.name,
  },
  {
    field: "unitName",
    headerName: "Unit",
    flex: 1,
    valueGetter: (_, row) => row.tblUnit?.name,
  },
  {
    field: "unitDescription",
    headerName: "Unit Description",
    flex: 1,
    valueGetter: (_, row) => row.tblUnit?.description,
  },
  { field: "setValue", headerName: "Set Value", width: 110 },
  { field: "operationalMinValue", headerName: "Min", width: 100 },
  { field: "operationalMaxValue", headerName: "Max", width: 100 },
  { field: "orderNo", headerName: "Order", width: 80 },
];

const TabMeasuresPage = ({ compType, label }: Props) => {
  const compTypeId = compType?.compTypeId;

  const [openForm, setOpenForm] = useState(false);
  const [mode, setMode] = useState<"create" | "update">("create");
  const [selectedId, setSelectedId] = useState<number | null>(null);

  // === getAll ===
  const getAll = useCallback(() => {
    return tblCompTypeMeasurePoint.getAll({
      filter: { compTypeId },
      include: {
        tblUnit: true,
        tblCounterType: true,
      },
    });
  }, [compTypeId]);

  // === useDataGrid ===
  const { rows, loading, handleDelete, handleRefresh } = useDataGrid(
    getAll,
    tblCompTypeMeasurePoint.deleteById,
    "compTypeMeasurePointId",
    !!compTypeId,
  );

  // === Handlers ===
  const handleCreate = () => {
    setSelectedId(null);
    setMode("create");
    handleUpsertOpen();
  };

  const handleEdit = (rowId: number) => {
    setSelectedId(rowId);
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
      <CustomizedDataGrid
        showToolbar={!!label}
        label={label}
        rows={rows}
        columns={columns}
        loading={loading}
        onRefreshClick={handleRefresh}
        onAddClick={handleCreate}
        onEditClick={handleEdit}
        onDoubleClick={handleEdit}
        onDeleteClick={handleDelete}
        getRowId={getRowId}
      />

      {/* === UPSERT === */}
      <MeasurePointUpsert
        open={openForm}
        mode={mode}
        recordId={selectedId}
        compTypeId={compTypeId!}
        onClose={handleUpsertClose}
        onSuccess={handleRefresh}
      />
    </>
  );
};

export default TabMeasuresPage;
