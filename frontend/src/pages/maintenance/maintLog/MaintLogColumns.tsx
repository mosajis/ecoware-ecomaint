import CellDateTime from "@/shared/components/dataGrid/cells/CellDateTime";
import CellLink from "@/shared/components/dataGrid/cells/CellLink";
import CellOverdueCount from "./customCell/CellOverDueCount";
import Chip from "@mui/material/Chip";
import CellFullName from "@/shared/components/dataGrid/cells/CellFullName";
import Tooltip from "@mui/material/Tooltip";
import CellUnexpected, {
  unexpectedMap,
} from "@/shared/components/dataGrid/cells/CellUnexpected";
import { TypeTblMaintLog } from "@/core/api/generated/api";
import { GridColDef } from "@mui/x-data-grid";
import { RouteDetail } from "./MaintLogRoute";

export const getRowId = (row: TypeTblMaintLog) => row.maintLogId;

const followStatusColorMap = {
  Reviewed: "success",
  Reviewed_Note: "info",
  "In Progress": "warning",
  Edit: "secondary",
  Comment: "info",
  Follow: "primary",
  F_Report: "info",
  "Add part": "secondary",
  "Waiting for part": "warning",
  "Wait from Rig": "warning",
  "Waite to Reply": "warning",
  "Send to Kish": "secondary",
  Recheck: "error",
} as const;

export const columns: GridColDef<TypeTblMaintLog>[] = [
  {
    field: "maintLogId",
    headerName: "No",
    width: 60,
    renderCell: ({ value, row }) => (
      <CellLink
        breadcrumb={row.tblComponentUnit?.compNo!}
        value={value}
        to={RouteDetail.to}
        params={{ id: row.maintLogId }}
      />
    ),
  },

  {
    field: "component",
    headerName: "Component",
    width: 200,
    valueGetter: (_, row) => row?.tblComponentUnit?.compNo,
  },
  {
    field: "jobCode",
    headerName: "JobCode",
    width: 100,
    valueGetter: (_, row) => row?.tblJobDescription?.jobDescCode,
  },
  {
    field: "jobDescTitle",
    headerName: "jobDescTitle",
    width: 200,
    valueGetter: (_, row) => row?.tblJobDescription?.jobDescTitle,
  },
  {
    field: "dateDone",
    headerName: "DateDone",
    width: 130,
    renderCell: ({ value }) => <CellDateTime value={value} />,
  },

  {
    field: "discipline",
    headerName: "Discipline",
    valueGetter: (_, row) => row?.tblDiscipline?.name,
    width: 100,
  },
  {
    field: "followStatus",
    headerName: "Follow Status",
    width: 150,
    renderCell: ({ row }) => {
      const value = row?.tblFollowStatus?.fsName;

      if (!value) return "-";

      return (
        <Chip
          label={value}
          size="small"
          color={
            followStatusColorMap[value as keyof typeof followStatusColorMap] ??
            "default"
          }
          variant="outlined"
        />
      );
    },
  },
  {
    field: "maintClass",
    headerName: "Maint Class",
    valueGetter: (_, row) => row?.tblMaintClass?.descr ?? "",
    width: 100,
  },
  {
    field: "maintType",
    headerName: "Maint Type",
    valueGetter: (_, row) => row?.tblMaintType?.descr ?? "",
    width: 100,
  },
  {
    field: "maintCase",
    headerName: "Maint Cause",
    valueGetter: (_, row) => row?.tblMaintCause?.descr ?? "",
    width: 100,
  },
  {
    field: "downTime",
    headerName: "DownTime",
    width: 80,
  },
  {
    field: "totalTimeSpent",
    headerName: "Emp / Hrs",
    width: 100,
    renderCell: ({ _, row }: any) => (
      <Tooltip title={` Total Time Spent: ${row.totalTimeSpent}`}>
        <div style={{ width: "100%", height: "100%" }}>
          {row.totalTimeSpentEmp}
        </div>
      </Tooltip>
    ),
  },
  {
    field: "countSpare",
    headerName: "Spare Count",
    width: 80,
  },
  {
    field: "countAttachment",
    headerName: "Attachment Count",
    width: 80,
  },
  {
    field: "overdueCount",
    headerName: "OverDue",
    width: 80,
    renderCell: ({ _, row }: any) => (
      <CellOverdueCount value={row.overdueCount} />
    ),
  },
  {
    field: "reportedDate",
    headerName: "ReportedDate",
    width: 130,
    renderCell: ({ value }) => <CellDateTime value={value} />,
  },
  {
    field: "tblEmployee",
    headerName: "ReportedBy",
    width: 150,
    renderCell: ({ _, row }: any) => <CellFullName value={row.tblEmployee} />,
  },
  {
    field: "unexpected",
    headerName: "Type",
    width: 150,
    valueGetter: (_, row) =>
      unexpectedMap[row.unexpected as keyof typeof unexpectedMap] ?? "-",

    renderCell: ({ _, row }: any) => <CellUnexpected value={row.unexpected} />,
  },
];
