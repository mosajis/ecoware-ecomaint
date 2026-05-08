import CellDateTime from "@/shared/components/dataGrid/cells/CellDateTime";
import CellLink from "@/shared/components/dataGrid/cells/CellLink";
import { TypeTblCompCounterLog } from "@/core/api/generated/api";
import { GridColDef } from "@mui/x-data-grid";

import { RouteDetail as RouteComponentUnitDetail } from "../componentUnit/ComponentUnitRoutes";
import { RouteDetail as RouteComponentTypeDetail } from "../componentType/ComponentTypeRoutes";

export const getRowId = (row: TypeTblCompCounterLog) => row.compCounterLogId;

export const columns: GridColDef<TypeTblCompCounterLog>[] = [
  {
    field: "component",
    headerName: "Component",
    flex: 1,
    // @ts-ignore
    valueGetter: (_, row) => row?.tblCompCounter?.tblComponentUnit?.compNo,
    renderCell: ({ value, row }) => (
      <CellLink
        breadcrumb={value}
        value={value}
        to={RouteComponentUnitDetail.to}
        // @ts-ignore
        params={{ id: row?.tblCompCounter?.tblComponentUnit?.compId }}
      />
    ),
  },
  {
    field: "componentType",
    headerName: "Component Type",
    flex: 1,
    valueGetter: (_, row) =>
      // @ts-ignore
      row?.tblCompCounter?.tblComponentUnit?.tblCompType?.compName,

    renderCell: ({ value, row }) => (
      <CellLink
        breadcrumb={value}
        value={value}
        to={RouteComponentTypeDetail.to}
        // @ts-ignore
        params={{ id: row?.tblCompCounter?.tblCompType?.compTypeId }}
      />
    ),
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
