import { TypeTblFailureReports } from "@/core/api/generated/api";
import CellDateTime from "@/shared/components/dataGrid/cells/CellDateTime";
import { GridColDef } from "@mui/x-data-grid";
import CellSeverity from "../_components/CellSeverity";

export const columns: GridColDef<TypeTblFailureReports>[] = [
  {
    field: "failureNumber",
    headerName: "No",
    width: 50,
  },
  {
    field: "componentName",
    headerName: "Component Name",
    flex: 1,
    valueGetter: (_, row) => row?.tblComponentUnit?.compNo,
  },
  {
    field: "failureDateTime",
    headerName: "Failure Date",
    width: 150,
    renderCell: ({ value }) => <CellDateTime value={value} />,
  },
  {
    field: "title",
    headerName: "Title",
    flex: 2,
    valueGetter: (_, row) => row.title,
  },
  {
    field: "totalWait",
    headerName: "Waiting",
    flex: 1,
    valueGetter: (_, row) => row.totalWait,
  },
  {
    field: "discipline",
    headerName: "Discipline",
    flex: 1,

    valueGetter: (_, row) => row?.tblDiscipline?.name,
  },

  {
    field: "lastupdate",
    headerName: "Last Updated",
    flex: 1,
    renderCell: ({ value }) => <CellDateTime value={value} />,
  },
  {
    field: "createdDate",
    headerName: "Created Date",
    flex: 1,
    renderCell: ({ value }) => <CellDateTime value={value} />,
  },
  {
    field: "createdBy",
    headerName: "Created By",
    flex: 1,
  },
  {
    field: "closedDateTime",
    headerName: "Close Date",
    width: 150,
    renderCell: ({ value }) => <CellDateTime value={value} />,
  },
  {
    field: "closedBy",
    headerName: "Closed By",
    flex: 1,
    valueGetter: (_, row) =>
      // @ts-ignore
      row?.tblUsersTblFailureReportsClosedUserIdTotblUsers?.userName,
  },

  {
    field: "nextFollow",
    headerName: "Next Follow  (Check)",
    flex: 1,
    valueGetter: (_, row) => row?.tblFailureGroupFollow?.name,
  },
  {
    field: "severity",
    headerName: "Severity",
    flex: 1,
    renderCell: ({ row }) => (
      <CellSeverity value={row.tblFailureSeverityLevel} />
    ),
  },

  {
    field: "followBy",
    headerName: "Follow By (not set)",
    flex: 1,
  },
  {
    field: "requestNo",
    headerName: "RequestNo",
    flex: 1,
  },

  {
    field: "jobOrderNo",
    headerName: "Job Order No (Check)",
    flex: 1,
  },
  {
    field: "maintCause",
    headerName: "Maint Cause (Check)",
    flex: 1,
  },
  {
    field: "reportedBy",
    headerName: "Reported By",
    flex: 1,
    valueGetter: (_, row) =>
      // @ts-ignore
      row?.tblUsersTblFailureReportsReportedUserIdTotblUsers?.uName,
  },
  {
    field: "approvedBy",
    headerName: "Approved By",
    flex: 1,
    valueGetter: (_, row) =>
      // @ts-ignore
      row?.tblUsersTblFailureReportsApprovedUserIdTotblUsers?.userName,
  },
];
