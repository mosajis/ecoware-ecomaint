import { TypeTblDailyReport } from "@/core/api/generated/api";
import CellDateTime from "@/shared/components/dataGrid/cells/CellDateTime";
import { GridColDef } from "@mui/x-data-grid";

export const getRowId = (row: TypeTblDailyReport) => row.dailyReportId;

export const columns: GridColDef<TypeTblDailyReport>[] = [
  {
    field: "reportTitle",
    headerName: "Title",
    flex: 1,
    minWidth: 250,
  },
  {
    field: "reportDate",
    headerName: "Report Date",
    width: 180,
    renderCell: ({ value }) => <CellDateTime value={value} type="DATE" />,
  },
  {
    field: "createdDate",
    headerName: "Created Date",
    width: 180,
    renderCell: ({ value }) => <CellDateTime value={value} />,
  },
  {
    field: "totalwaiting",
    headerName: "Total Waiting",
    width: 150,
  },
  {
    field: "lastUpdate",
    headerName: "Last Update",
    width: 100,
    renderCell: ({ value }) => <CellDateTime value={value} />,
  },
];
