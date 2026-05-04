import { TypeTblCompMeasurePoint } from "@/core/api/generated/api";
import CellDateTime from "@/shared/components/dataGrid/cells/CellDateTime";
import { GridColDef } from "@mui/x-data-grid";

export const getRowId = (row: TypeTblCompMeasurePoint) =>
  row.compMeasurePointId;

export const columns: GridColDef<TypeTblCompMeasurePoint>[] = [
  {
    field: "compNo",
    headerName: "Component",
    flex: 1,
    valueGetter: (_, row) => row?.tblComponentUnit?.compNo,
  },
  {
    field: "compType",
    headerName: "Component Type",
    flex: 1,
    // @ts-ignore
    valueGetter: (_, row) => row?.tblComponentUnit?.tblCompType?.compName,
  },

  {
    field: "measureName",
    headerName: "Measurepoint",
    flex: 1,

    valueGetter: (_, row) => row.tblCounterType?.name,
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
  },
  {
    field: "setValue",
    headerName: "Set Value",
  },
  {
    field: "operationalMinValue",
    headerName: "Min Value",
  },

  {
    field: "operationalMaxValue",
    headerName: "Max Value",
  },

  {
    field: "unitDescription",
    headerName: "Unit Descr",
    valueGetter: (_, row) => row.tblUnit?.description,
  },
];
