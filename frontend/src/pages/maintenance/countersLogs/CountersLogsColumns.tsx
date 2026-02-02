import CellDateTime from "@/shared/components/dataGrid/cells/CellDateTime";
import { TypeTblCompCounterLog } from "@/core/api/generated/api";
import { GridColDef } from "@mui/x-data-grid";

export const getRowId = (row: TypeTblCompCounterLog) => row.compCounterLogId;

export const columns: GridColDef<TypeTblCompCounterLog>[] = [
  {
    field: "component",
    headerName: "Component",
    flex: 1,
    // @ts-ignore
    valueGetter: (_, row) => row?.tblCompCounter?.tblComponentUnit?.compNo,
  },
  {
    field: "componentType",
    headerName: "Component Type",
    flex: 1,
    valueGetter: (_, row) =>
      // @ts-ignore
      row?.tblCompCounter?.tblComponentUnit?.tblCompType?.compName,
  },
  {
    field: "counterName",
    headerName: "Counter Name",
    flex: 1,
    // @ts-ignore
    valueGetter: (_, row) => row?.tblCompCounter?.tblCounterType?.name,
  },
  {
    field: "startDate",
    headerName: "Start Date",
    width: 130,
    renderCell: ({ value }) => <CellDateTime value={value} />,
  },
  {
    field: "startValue",
    headerName: "Start Value",
    width: 120,
    valueGetter: (_, row) => row.startValue,
  },
  {
    field: "currentDate",
    headerName: "Current Date",
    width: 130,
    renderCell: ({ value }) => <CellDateTime value={value} />,
  },
  {
    field: "currentValue",
    headerName: "Current Value",
    width: 120,
    valueGetter: (_, row) => row.currentValue,
  },
];
