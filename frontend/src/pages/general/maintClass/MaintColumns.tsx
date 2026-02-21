import { GridColDef } from "@mui/x-data-grid";
import {
  TypeTblMaintCause,
  TypeTblMaintClass,
  TypeTblMaintType,
} from "@/core/api/generated/api";

export const getRowIdClass = (row: TypeTblMaintClass) => row.maintClassId;
export const getRowIdCause = (row: TypeTblMaintCause) => row.maintCauseId;
export const getRowIdType = (row: TypeTblMaintType) => row.maintTypeId;

export const columns: GridColDef<any>[] = [
  { field: "descr", headerName: "Description", flex: 1 },
  { field: "orderNo", headerName: "Order No", width: 80 },
];
