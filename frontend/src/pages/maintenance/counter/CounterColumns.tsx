import CellDateTime from "@/shared/components/dataGrid/cells/CellDateTime";
import { TypeTblCompCounter } from "@/core/api/generated/api";
import { GridColDef } from "@mui/x-data-grid";
import CellFullName from "@/shared/components/dataGrid/cells/CellFullName";

export const getRowId = (row: TypeTblCompCounter) => row.compCounterId;

export const buildColumns = (): GridColDef<TypeTblCompCounter>[] => [
  {
    field: "component",
    headerName: "Component",
    flex: 1,
    valueGetter: (_, row) => row.tblComponentUnit?.compNo,
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
    field: "changedBy",
    headerName: "Changed By",
    flex: 1,
    valueGetter: (_, row) => row.tblEmployee,
    renderCell: ({ value }) => <CellFullName value={value} />,
  },
  {
    field: "orderNo",
    headerName: "Order No",
    width: 85,
  },
];

export const columns = buildColumns();
