import { TypeTblCompCounter } from "@/core/api/generated/api";
import CellDateTime from "@/shared/components/dataGrid/cells/CellDateTime";
import { GridColDef } from "@mui/x-data-grid";

export const getRowId = (row: TypeTblCompCounter) => row.compCounterId;

export const columns: GridColDef<TypeTblCompCounter>[] = [
  {
    field: "component",
    headerName: "component",
    flex: 1,
    valueGetter: (_, row) => row.tblComponentUnit?.compNo,
  },
  {
    field: "counterType",
    headerName: "Counter Type",
    flex: 1,
    valueGetter: (_, row) => row.tblCounterType?.name || "",
  },
  {
    field: "currentDate",
    headerName: "Current Date",
    flex: 1,
    renderCell: ({ value }) => <CellDateTime value={value} />,
  },
  {
    field: "currentValue",
    headerName: "Current Value",
    flex: 1,
  },
  {
    field: "startDate",
    headerName: "Start Date",
    flex: 1,
    renderCell: ({ value }) => <CellDateTime value={value} />,
  },
  {
    field: "startValue",
    headerName: "Start Value",
    flex: 1,
  },
  {
    field: "useCalcAverage",
    headerName: "Use Calc Avg",
    width: 120,
    type: "boolean",
  },
  {
    field: "averageCountRate",
    headerName: "Avg Rate",
    flex: 1,
  },
  {
    field: "orderNo",
    headerName: "Order No",
    width: 85,
  },
];
