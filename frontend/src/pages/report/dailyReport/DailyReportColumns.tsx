import CellDateTime from "@/shared/components/dataGrid/cells/CellDateTime";
import { TypeTblDailyReport } from "@/core/api/generated/api";
import { GridColDef } from "@mui/x-data-grid";

const getRowId = (row: TypeTblDailyReport) => row.dailyReportId;

const columns: GridColDef<TypeTblDailyReport>[] = [
  {
    field: "reportTitle",
    headerName: "Title",
    flex: 2,
  },
  {
    field: "totalwaiting",
    headerName: "Total Waiting",
    flex: 1,
  },
  {
    field: "reportDate",
    headerName: "Report Date",
    flex: 1,
    renderCell: ({ value }) => <CellDateTime value={value} type="DATE" />,
  },
  {
    field: "createdDate",
    headerName: "Created Date",
    flex: 1,
    renderCell: ({ value }) => <CellDateTime value={value} type="DATE" />,
  },
  {
    field: "lastUpdate",
    headerName: "Last Update",
    width: 130,
    renderCell: ({ value }) => <CellDateTime value={value} />,
  },
];

export { columns, getRowId };
