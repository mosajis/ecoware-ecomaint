import { TypeTblCompMeasurePointLog } from "@/core/api/generated/api";
import CellDateTime from "@/shared/components/dataGrid/cells/CellDateTime";
import { GridColDef } from "@mui/x-data-grid";

export const getRowId = (row: TypeTblCompMeasurePointLog) =>
  row.compMeasurePointLogId;

export const columns: GridColDef<TypeTblCompMeasurePointLog>[] = [
  {
    field: "compNo",
    headerName: "Component",
    flex: 2,
    // @ts-ignore
    valueGetter: (_, row) => row?.tblCompMeasurePoint?.tblComponentUnit.compNo,
  },
  {
    field: "compType",
    headerName: "Component Type",
    flex: 1,
    valueGetter: (_, row) =>
      // @ts-ignore
      row?.tblCompMeasurePoint?.tblComponentUnit?.tblCompType?.compName,
  },

  {
    field: "measureName",
    headerName: "Measure Type",
    width: 200,
    // @ts-ignore
    valueGetter: (_, row) => row?.tblCompMeasurePoint?.tblCounterType.name,
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
    flex: 1,
    valueGetter: (_, row) => row.currentValue,
  },
  {
    field: "unitName",
    headerName: "Unit Name",
    valueGetter: (_, row) => row?.tblUnit?.name,
  },
  {
    field: "changedDate",
    headerName: "Changed Date",
    width: 130,
    renderCell: ({ value }) => <CellDateTime value={value} />,
  },
  {
    field: "minValue",
    headerName: "Min Value",
    width: 150,
    valueGetter: (_, row) => row?.tblCompMeasurePoint?.operationalMinValue,
  },
  {
    field: "maxValue",
    headerName: "Max Value",
    valueGetter: (_, row) => row?.tblCompMeasurePoint?.operationalMaxValue,
  },

  {
    field: "unitDescription",
    headerName: "Unit Descr",
    valueGetter: (_, row) => row?.tblUnit?.description,
  },
];
