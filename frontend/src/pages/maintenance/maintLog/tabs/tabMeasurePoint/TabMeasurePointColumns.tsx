import CellDateTime from "@/shared/components/dataGrid/cells/CellDateTime";
import { GridColDef } from "@mui/x-data-grid";
import {
  TypeTblCompJobMeasurePoint,
  TypeTblCompMeasurePoint,
} from "@/core/api/generated/api";

export const getRowId = (row: TypeTblCompJobMeasurePoint) =>
  row.compJobMeasurePointId;

export const columns: GridColDef<TypeTblCompJobMeasurePoint>[] = [
  {
    field: "counterTypeName",
    headerName: "Measure Name",
    flex: 1,
    valueGetter: (_, row) =>
      // @ts-ignore
      row?.tblCompMeasurePoint?.tblCounterType?.name || "—",
  },
  {
    field: "currentValue",
    headerName: "Current Value",
    flex: 1,
    align: "left",
    valueGetter: (_, row) =>
      // @ts-ignore
      row?.tblCompMeasurePoint?.currentValue ?? "—",
  },
  {
    field: "unitName",
    headerName: "Unit",
    flex: 1,
    // @ts-ignore
    valueGetter: (_, row) => row?.tblCompMeasurePoint?.tblUnit?.name || "—",
  },
];
