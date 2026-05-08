import CellDateTime from "@/shared/components/dataGrid/cells/CellDateTime";
import { TypeTblCompMeasurePointLog } from "@/core/api/generated/api";
import { GridColDef } from "@mui/x-data-grid";
import { RouteDetail as RouteComponentUnitDetail } from "../componentUnit/ComponentUnitRoutes";

import { RouteDetail as RouteComponentTypeDetail } from "../componentType/ComponentTypeRoutes";
import CellLink from "@/shared/components/dataGrid/cells/CellLink";

export const getRowId = (row: TypeTblCompMeasurePointLog) =>
  row.compMeasurePointLogId;

export const columns: GridColDef<TypeTblCompMeasurePointLog>[] = [
  {
    field: "compNo",
    headerName: "Component",
    flex: 2,
    // @ts-ignore
    valueGetter: (_, row) => row?.tblCompMeasurePoint?.tblComponentUnit.compNo,
    renderCell: ({ value, row }) => (
      <CellLink
        breadcrumb={value}
        value={value}
        to={RouteComponentUnitDetail.to}
        // @ts-ignore
        params={{ id: row?.tblCompMeasurePoint?.tblComponentUnit?.compId }}
      />
    ),
  },
  {
    field: "compType",
    headerName: "Component Type",
    flex: 1,
    valueGetter: (_, row) =>
      // @ts-ignore
      row?.tblCompMeasurePoint?.tblComponentUnit?.tblCompType?.compName,
    renderCell: ({ value, row }) => (
      <CellLink
        breadcrumb={value}
        value={value}
        to={RouteComponentTypeDetail.to}
        params={{
          // @ts-ignore
          id: row?.tblCompMeasurePoint?.tblComponentUnit?.tblCompType
            ?.compTypeId,
        }}
      />
    ),
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
