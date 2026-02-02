import CustomizedDataGrid from "@/shared/components/dataGrid/DataGrid";
import Upsert from "./TabMeasuresUpsert";
import CellDateTime from "@/shared/components/dataGrid/cells/CellDateTime";
import Button from "@mui/material/Button";
import MeasurePointsTrend from "@/pages/maintenance/measurePoints/MeasurePointsTrend";
import { useCallback, useMemo, useState } from "react";
import { GridColDef, GridRowSelectionModel } from "@mui/x-data-grid";
import { useDataGrid } from "@/shared/hooks/useDataGrid";
import {
  tblCompMeasurePoint,
  TypeTblComponentUnit,
  TypeTblCompMeasurePoint,
} from "@/core/api/generated/api";
import { LineChart } from "@mui/x-charts";
import { BarChartSharp, ChairAlt, StackedLineChart } from "@mui/icons-material";

type Props = {
  componentUnit?: TypeTblComponentUnit | null;
  label?: string;
};
const getRowId = (row: TypeTblCompMeasurePoint) => row.compMeasurePointId;

// === Columns ===
const columns: GridColDef<TypeTblCompMeasurePoint>[] = [
  {
    field: "measureName",
    headerName: "Measure",
    flex: 1,
    valueGetter: (_, row) => row.tblCounterType?.name || "",
  },
  {
    field: "currentDate",
    headerName: "Current Date",
    width: 135,
    renderCell: ({ value }) => <CellDateTime value={value} />,
  },
  { field: "currentValue", headerName: "Current Value", width: 120 },
  {
    field: "unitName",
    headerName: "Unit",
    flex: 1,
    valueGetter: (_, row) => row.tblUnit?.name || "",
  },
  {
    field: "unitDescription",
    headerName: "Unit Description",
    flex: 1,
    valueGetter: (_, row) => row.tblUnit?.description || "",
  },
  { field: "setValue", headerName: "Set Value", width: 110 },
  { field: "operationalMinValue", headerName: "Min", width: 100 },
  { field: "operationalMaxValue", headerName: "Max", width: 100 },
  { field: "orderNo", headerName: "Order", width: 80 },
];

const TabCompMeasurePoint = ({ componentUnit, label }: Props) => {
  const compId = componentUnit?.compId;

  const [openTrend, setOpenTrend] = useState(false);
  const [openForm, setOpenForm] = useState(false);
  const [mode, setMode] = useState<"create" | "update">("create");
  const [selectedId, setSelectedId] = useState<number | null>(null);

  // Row selection model
  const [rowSelectionModel, setRowSelectionModel] =
    useState<GridRowSelectionModel>({
      type: "include",
      ids: new Set(),
    });

  // Fetch all rows
  const getAll = useCallback(() => {
    return tblCompMeasurePoint.getAll({
      filter: { compId },
      include: {
        tblUnit: true,
        tblCounterType: true,
        tblCompJobMeasurePoints: true,
        tblComponentUnit: true,
      },
    });
  }, [compId]);

  const { rows, loading, handleDelete, handleRefresh } = useDataGrid(
    getAll,
    tblCompMeasurePoint.deleteById,
    "compMeasurePointId",
    !!compId,
  );

  // === Handlers ===
  const handleCreate = () => {
    setSelectedId(null);
    setMode("create");
    setOpenForm(true);
  };

  const handleEdit = (rowId: number) => {
    setSelectedId(rowId);
    setMode("update");
    setOpenForm(true);
  };

  const handleUpsertClose = () => setOpenForm(false);

  const selectedRowId = useMemo(() => {
    const ids = Array.from(rowSelectionModel.ids);
    return ids.length === 1 ? ids[0] : null;
  }, [rowSelectionModel]);

  const selectedRow = useMemo(() => {
    return rows.find((row) => row.compMeasurePointId === selectedRowId) || null;
  }, [rows, selectedRowId]);

  return (
    <>
      <CustomizedDataGrid
        disableEdit
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
        rowSelectionModel={rowSelectionModel}
        onRowSelectionModelChange={setRowSelectionModel}
        toolbarChildren={
          <Button
            onClick={() => setOpenTrend(true)}
            disabled={!selectedRowId}
            size="small"
            startIcon={<BarChartSharp />}
          >
            Trend
          </Button>
        }
      />
      {JSON.stringify(selectedRow)}
      <MeasurePointsTrend
        open={openTrend}
        onClose={() => setOpenTrend(false)}
        compMeasurePointId={selectedRow?.compMeasurePointId!}
        title={selectedRow?.tblComponentUnit?.compNo || ""}
      />
      <Upsert
        open={openForm}
        mode={mode}
        recordId={selectedId}
        compId={compId!}
        onClose={handleUpsertClose}
        onSuccess={handleRefresh}
      />
    </>
  );
};

export default TabCompMeasurePoint;
