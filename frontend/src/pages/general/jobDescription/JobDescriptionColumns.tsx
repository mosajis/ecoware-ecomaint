import { TypeTblJobDescription } from "@/core/api/generated/api";
import { GridColDef } from "@mui/x-data-grid";

export const getRowId = (row: TypeTblJobDescription) => row.jobDescId;

// === Columns ===
export const columns: GridColDef<TypeTblJobDescription>[] = [
  { field: "jobDescCode", headerName: "Code", width: 120 },
  { field: "jobDescTitle", headerName: "JobTitle", flex: 2 },
  {
    field: "jobClass",
    headerName: "JobClass",
    flex: 1,
    valueGetter: (value, row) => row?.tblJobClass?.name,
  },
  { field: "changeReason", headerName: "ChangeReason", flex: 1 },
];
