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
  const [selectedRowId, setSelectedRowId] = useState<number | null>(null);
  const [selectedRow, setSelectedRow] =
    useState<TypeTblCompMeasurePoint | null>(null);

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
    setSelectedRowId(null);
    setMode("create");
    setOpenForm(true);
  };

  const handleEdit = (rowId: number) => {
    setSelectedRowId(rowId);
    setMode("update");
    setOpenForm(true);
  };

  const handleUpsertClose = () => setOpenForm(false);

  const handleRowSelect = ({ row }: { row: TypeTblCompMeasurePoint }) => {
    if (selectedRowId !== row.compMeasurePointId) {
      setSelectedRowId(row.compMeasurePointId);
      setSelectedRow(row);
      return;
    }
    setSelectedRow(null);
    setSelectedRowId(null);
  };

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
        onRowClick={handleRowSelect}
        getRowId={getRowId}
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
      <MeasurePointsTrend
        open={openTrend}
        onClose={() => setOpenTrend(false)}
        compMeasurePointId={selectedRow?.compMeasurePointId!}
        title={selectedRow?.tblComponentUnit?.compNo || ""}
      />
      <Upsert
        open={openForm}
        mode={mode}
        recordId={selectedRowId}
        compId={compId!}
        onClose={handleUpsertClose}
        onSuccess={handleRefresh}
      />
    </>
  );
};

export default TabCompMeasurePoint;
