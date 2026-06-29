import CellDateTime from "@/shared/components/dataGrid/cells/CellDateTime";
import CellDailyReportTitle from "./_components/CellDailyReportTitle";
import { TypeTblDailyReport } from "@/core/api/generated/api";
import { GridColDef } from "@mui/x-data-grid";

const getRowId = (row: TypeTblDailyReport) => row.dailyReportId;

const columns: GridColDef<TypeTblDailyReport>[] = [
  {
    field: "reportTitle",
    headerName: "Title",
    flex: 2,
    renderCell: ({ value, row }) => <CellDailyReportTitle row={row} />,
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
    field: "discipline",
    headerName: "Discipline",
    width: 130,
    valueGetter: (_, row) => row?.tblDiscipline?.name,
  },
  {
    field: "createdDate",
    headerName: "Created Date",
    flex: 1,
    renderCell: ({ value }) => <CellDateTime value={value} type="DATE" />,
  },
];

export { columns, getRowId };
