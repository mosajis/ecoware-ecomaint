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
    // @ts-ignore
    valueGetter: (_, row) => row?.tblMaintLog?.tblComponentUnit?.compNo,
  },
  {
    field: "failureDateTime",
    headerName: "Failure Date",
    width: 150,
    valueGetter: (_, row) => row?.tblMaintLog?.dateDone,
    renderCell: ({ value }) => <CellDateTime value={value} />,
  },
  {
    field: "title",
    headerName: "Title",
    flex: 2,
    valueGetter: (_, row) => row.title,
  },
  {
    field: "downTime",
    headerName: "Down Time",
    flex: 1,
    valueGetter: (_, row) => row.tblMaintLog?.downTime,
  },
  {
    field: "discipline",
    headerName: "Discipline not set",
    flex: 1,
    // @ts-ignore
    valueGetter: (_, row) => row?.tblMaintLog?.tblDiscipline?.name,
  },
  {
    field: "reportDate",
    headerName: "Report Date",
    flex: 1,
    valueGetter: (_, row) => row?.tblMaintLog?.reportedDate,
    renderCell: ({ value }) => <CellDateTime value={value} />,
  },
  {
    field: "reportedBy",
    headerName: "Report By",
    flex: 1,
    valueGetter: (_, row) =>
      // @ts-ignore
      row?.tblMaintLog?.tblUsersTblMaintLogReportedByTotblUsers?.uName,
  },
  {
    field: "closedDateTime",
    headerName: "Close Date",
    flex: 1,

    renderCell: ({ value }) => <CellDateTime value={value} />,
  },
  {
    field: "closedBy",
    headerName: "Closed By",
    flex: 1,
    valueGetter: (_, row) => row?.tblUsers?.uName,
  },

  {
    field: "nextFollowDate",
    headerName: "Next Follow Date",
    flex: 1,
    renderCell: ({ value }) => <CellDateTime value={value} type="DATE" />,
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
    field: "followGroup",
    headerName: "Follow Group",
    flex: 1,
    valueGetter: (_, row) => row?.tblFailureGroupFollow?.name,
  },
  {
    field: "requestNo",
    headerName: "RequestNo",
    flex: 1,
  },
  {
    field: "maintCause",
    headerName: "Maint Cause",
    flex: 1,
    // @ts-ignore
    valueGetter: (_, row) => row?.tblMaintLog?.tblMaintCause?.descr,
  },
];
