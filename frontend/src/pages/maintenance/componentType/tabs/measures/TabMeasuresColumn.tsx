import { TypeTblCompTypeMeasurePoint } from "@/core/api/generated/api";
import CellDateTime from "@/shared/components/dataGrid/cells/CellDateTime";
import { GridColDef } from "@mui/x-data-grid";

export const getRowId = (row: TypeTblCompTypeMeasurePoint) =>
  row.compTypeMeasurePointId;

// === Columns ===
export const columns: GridColDef<TypeTblCompTypeMeasurePoint>[] = [
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
