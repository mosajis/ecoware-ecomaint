import {
  TypeTblMaintLog,
  TypeTblMaintLogStocks,
} from "@/core/api/generated/api";
import CellDateTime from "@/shared/components/dataGrid/cells/CellDateTime";
import { GridColDef } from "@mui/x-data-grid";

export const getRowId = (row: TypeTblMaintLogStocks) => row.maintLogStockId;
export const maintLogGetRowId = (row: TypeTblMaintLog) => row.maintLogId;

export const columns: GridColDef<TypeTblMaintLogStocks>[] = [
  {
    field: "partName",
    headerName: "Part Name",
    flex: 2,
    // @ts-ignore
    valueGetter: (_, row) => row.tblSpareUnit?.tblSpareType?.name,
  },
  {
    field: "totalCount",
    headerName: "Total Count",
    width: 130,
  },
  {
    field: "totalUse",
    headerName: "Total Use",
    width: 130,
  },
  {
    field: "partTypeNo",
    headerName: "MESC Code",
    flex: 1,
    // @ts-ignore
    valueGetter: (_, row) => row?.tblSpareUnit?.tblSpareType.partTypeNo,
  },
  {
    field: "makerRefNo",
    headerName: "Maker Ref",
    flex: 1,
    // @ts-ignore
    valueGetter: (_, row) => row?.tblSpareUnit?.tblSpareType.makerRefNo,
  },
  {
    field: "extraNo",
    headerName: "Extra No",
    flex: 1,
    // @ts-ignore
    valueGetter: (_, row) => row?.tblSpareUnit?.tblSpareType.extraNo,
  },
  {
    field: "note",
    headerName: "Note",
    flex: 1,
    // @ts-ignore
    valueGetter: (_, row) => row?.tblSpareUnit?.tblSpareType.note,
  },
  {
    field: "unit",
    headerName: "Unit",
    flex: 1,
    // @ts-ignore
    valueGetter: (_, row) => row?.tblSpareUnit?.tblSpareType?.tblUnit?.name,
  },
];

export const maintLogColumns: GridColDef<TypeTblMaintLogStocks>[] = [
  {
    field: "component",
    headerName: "Component",
    flex: 1,
    // @ts-ignore
    valueGetter: (_, row) => row?.tblMaintLog?.tblComponentUnit?.compNo,
  },
  {
    field: "jobCode",
    headerName: "JobCode",
    width: 100,
    // @ts-ignore
    valueGetter: (_, row) => row?.tblMaintLog?.tblJobDescription?.jobDescCode,
  },
  {
    field: "jobDescTitle",
    headerName: "jobDescTitle",
    flex: 1,
    // @ts-ignore
    valueGetter: (_, row) => row?.tblMaintLog?.tblJobDescription?.jobDescTitle,
  },
  {
    field: "dateDone",
    headerName: "DateDone",
    width: 130,
    valueGetter: (_, row) => row?.tblMaintLog?.dateDone,

    renderCell: ({ value }) => <CellDateTime value={value} />,
  },
  {
    field: "maintClass",
    headerName: "Maint Class",
    // @ts-ignore
    valueGetter: (_, row) => row?.tblMaintLog?.tblMaintClass?.descr ?? "",
  },
  {
    field: "downTime",
    headerName: "DownTime (Min)",
    valueGetter: (_, row) => row?.tblMaintLog?.downTime,
    width: 130,
  },

  {
    field: "unplanned",
    headerName: "Unplanned",
    valueGetter: (_, row) => row?.tblMaintLog?.unplanned,
    type: "boolean",
    width: 95,
  },
];
