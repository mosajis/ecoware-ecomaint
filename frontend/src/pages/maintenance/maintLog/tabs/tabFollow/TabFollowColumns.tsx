import { TypeTblMaintLogFollow } from "@/core/api/generated/api";
import CellFullName from "@/shared/components/dataGrid/cells/CellFullName";
import { GridColDef } from "@mui/x-data-grid";

export const getRowId = (row: TypeTblMaintLogFollow) => row.followId;
export const columns: GridColDef<TypeTblMaintLogFollow>[] = [
  {
    field: "followBy",
    headerName: "Follow By",
    flex: 1,
    valueGetter: (_, row) => row?.tblUsers,
    renderCell: ({ value }) => <CellFullName value={value} />,
  },
  {
    field: "status",
    headerName: "Status",
    flex: 1,
    valueGetter: (_, row) => row.tblFollowStatus?.fsName,
  },
  {
    field: "isRequest",
    headerName: "Is Request",
    flex: 1,
    type: "boolean",
  },
  {
    field: "isUnPlan",
    headerName: "Unplanned",
    flex: 1,
    type: "boolean",
  },
  { field: "waitingTime", headerName: "Waiting (Minutes)", flex: 1 },
  { field: "followDate", headerName: "Follow Date", flex: 1 },
];
