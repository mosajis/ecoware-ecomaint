import { TypeTblCompJobMeasurePoint } from "@/core/api/generated/api";
import { GridColDef } from "@mui/x-data-grid";

export const getRowId = (row: TypeTblCompJobMeasurePoint) =>
  row.compJobMeasurePointId;

// === Columns ===
export const columns: GridColDef<TypeTblCompJobMeasurePoint>[] = [
  {
    field: "measureName",
    headerName: "Measure Name",
    flex: 1,
    valueGetter: (v, row) =>
      // @ts-ignore
      row?.tblCompMeasurePoint?.tblCounterType?.name,
  },
  {
    field: "unitName",
    headerName: "Unit Name",
    flex: 1,
    // @ts-ignore
    valueGetter: (v, row) => row?.tblCompMeasurePoint?.tblUnit?.name,
  },
  {
    field: "unitDescription",
    headerName: "Unit Description",
    flex: 1,
    // @ts-ignore
    valueGetter: (v, row) =>
      // @ts-ignore
      row?.tblCompMeasurePoint?.tblUnit?.description,
  },

  {
    field: "minValue",
    headerName: "Min Value",
    flex: 1,
  },
  {
    field: "maxValue",
    headerName: "Max Value",
    flex: 1,
  },
  {
    field: "updateOnReport",
    headerName: "Update On Report",
    flex: 1,
    type: "boolean",
  },
  {
    field: "useOperationalValues",
    headerName: "use Operational Values",
    flex: 1,
    type: "boolean",
  },
];
