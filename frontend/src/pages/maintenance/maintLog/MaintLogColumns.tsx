import CellDateTime from "@/shared/components/dataGrid/cells/CellDateTime";
import CellLink from "@/shared/components/dataGrid/cells/CellLink";
import CellUnexpected, {
  unexpectedMap,
} from "@/shared/components/dataGrid/cells/CellUnexpected";
import CellOverdueCount from "./customCell/CellOverDueCount";
import CellFullName from "@/shared/components/dataGrid/cells/CellFullName";
import { TypeTblMaintLog } from "@/core/api/generated/api";
import { GridColDef } from "@mui/x-data-grid";
import { RouteDetail } from "./MaintLogRoute";
import { Tooltip } from "@mui/material";

export const getRowId = (row: TypeTblMaintLog) => row.maintLogId;

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
    flex: 1,
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
    flex: 1,
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
    flex: 1,
  },
  {
    field: "followStatus",
    headerName: "Follow Status",
    width: 130,
    valueGetter: (_, row) => row?.tblFollowStatus?.fsName,
  },
  {
    field: "maintClass",
    headerName: "Maint Class",
    valueGetter: (_, row) => row?.tblMaintClass?.descr ?? "",
    flex: 1,
  },
  {
    field: "maintType",
    headerName: "Maint Type",
    valueGetter: (_, row) => row?.tblMaintType?.descr ?? "",
    flex: 1,
  },
  {
    field: "maintCase",
    headerName: "Maint Case",
    valueGetter: (_, row) => row?.tblMaintCause?.descr ?? "",
    flex: 1,
  },
  {
    field: "downTime",
    headerName: "DownTime",
    flex: 1,
  },
  {
    field: "totalTimeSpent",
    headerName: "Emp / Hrs",
    width: 80,
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
    field: "tblEmployee",
    headerName: "ReportedBy",
    width: 80,
    renderCell: ({ _, row }: any) => <CellFullName value={row.tblEmployee} />,
  },
  {
    field: "unexpected",
    headerName: "Type",
    flex: 1,
    valueGetter: (_, row) =>
      unexpectedMap[row.unexpected as keyof typeof unexpectedMap] ?? "-",

    renderCell: ({ _, row }: any) => <CellUnexpected value={row.unexpected} />,
  },
];
