import { TypeTblMaintLog } from "@/core/api/generated/api";
import CellDateTime from "@/shared/components/dataGrid/cells/CellDateTime";
import { GridColDef } from "@mui/x-data-grid";

export const getRowId = (row: TypeTblMaintLog) => row.maintLogId;

export const columns: GridColDef<TypeTblMaintLog>[] = [
  {
    field: "component",
    headerName: "Component",
    flex: 1,
    valueGetter: (_, row) => row?.tblComponentUnit?.compNo,
  },
  {
    field: "jobCode",
    headerName: "Job Code",
    flex: 1,
    valueGetter: (_, row) => row?.tblJobDescription?.jobDescCode,
  },
  {
    field: "jobName",
    headerName: "Job Name",
    flex: 1,
    valueGetter: (_, row) => row?.tblJobDescription?.jobDescTitle,
  },
  {
    field: "dateDone",
    headerName: "Date Done",
    width: 130,
    renderCell: ({ value }) => <CellDateTime value={value} />,
  },

  {
    field: "followStatus",
    headerName: "Follow Status",
    flex: 1,
    valueGetter: (_, row) => row?.tblFollowStatus?.fsName,
  },
  {
    field: "empHrs",
    headerName: "Emp / Hrs",
    flex: 1,
    valueGetter: (_, row) => row?.totalDuration,
  },
  {
    field: "maintClass",
    headerName: "Maint Class",
    flex: 1,
    valueGetter: (_, row) => row?.tblMaintClass?.descr,
  },
  {
    field: "downTime",
    headerName: "DownTime (min)",
    flex: 1,
    valueGetter: (_, row) => row?.downTime,
  },
  {
    field: "compStatus",
    headerName: "Comp Status",
    flex: 1,
    valueGetter: (_, row) =>
      // @ts-ignore
      row?.tblComponentUnit?.tblCompStatus?.compStatusName,
  },
  {
    field: "unexpected",
    headerName: "UnPlanned",
    flex: 1,
    type: "boolean",
  },
];
