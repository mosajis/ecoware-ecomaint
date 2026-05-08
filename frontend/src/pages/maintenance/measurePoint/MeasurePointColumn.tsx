import CellLink from "@/shared/components/dataGrid/cells/CellLink";
import CellDateTime from "@/shared/components/dataGrid/cells/CellDateTime";
import { TypeTblCompMeasurePoint } from "@/core/api/generated/api";
import { GridColDef } from "@mui/x-data-grid";
import { RouteDetail as RouteComponentUnitDetail } from "../componentUnit/ComponentUnitRoutes";
import { RouteDetail as RouteComponentTypeDetail } from "../componentType/ComponentTypeRoutes";

export const getRowId = (row: TypeTblCompMeasurePoint) =>
  row.compMeasurePointId;

export const columns: GridColDef<TypeTblCompMeasurePoint>[] = [
  {
    field: "compNo",
    headerName: "Component",
    flex: 1,
    valueGetter: (_, row) => row?.tblComponentUnit?.compNo,
    renderCell: ({ value, row }) => (
      <CellLink
        breadcrumb={value}
        value={value}
        to={RouteComponentUnitDetail.to}
        params={{ id: row?.tblComponentUnit?.compId }}
      />
    ),
  },
  {
    field: "compType",
    headerName: "Component Type",
    flex: 1,
    // @ts-ignore
    valueGetter: (_, row) => row?.tblComponentUnit?.tblCompType?.compName,
    renderCell: ({ value, row }) => (
      <CellLink
        breadcrumb={value}
        value={value}
        to={RouteComponentTypeDetail.to}
        // @ts-ignore
        params={{ id: row?.tblComponentUnit?.tblCompType?.compTypeId }}
      />
    ),
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
