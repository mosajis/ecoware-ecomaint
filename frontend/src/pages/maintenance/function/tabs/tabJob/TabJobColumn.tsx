import { TypeTblCompJob } from "@/core/api/generated/api";
import CellDateTime from "@/shared/components/dataGrid/cells/CellDateTime";
import CellFrequency from "@/shared/components/dataGrid/cells/CellFrequency";
import { GridColDef } from "@mui/x-data-grid";

export const getRowId = (row: TypeTblCompJob) => row.compJobId;

export const columns: GridColDef<TypeTblCompJob>[] = [
  {
    field: "jobDescCode",
    headerName: "Code",
    width: 100,
    valueGetter: (_, row) => row.tblJobDescription?.jobDescCode,
  },
  {
    field: "jobDescTitle",
    headerName: "Job Title",
    flex: 1,
    valueGetter: (_, row) => row.tblJobDescription?.jobDescTitle,
  },
  {
    field: "discipline",
    headerName: "Discipline",
    flex: 1,
    valueGetter: (_, row) => row.tblDiscipline?.name ?? "",
  },
  {
    field: "frequency",
    headerName: "Frequency",
    width: 150,
    renderCell: ({ row, value }) => (
      <CellFrequency frequency={value} frequencyPeriod={row.tblPeriod} />
    ),
  },
  {
    field: "lastDone",
    headerName: "Last Done",
    width: 130,
    renderCell: ({ value }) => <CellDateTime value={value} />,
  },
  {
    field: "nextDueDate",
    headerName: "Next Due Date",
    width: 130,
    renderCell: ({ value }) => <CellDateTime value={value} />,
  },
];
