import { TypeTblCompJob } from "@/core/api/generated/api";
import CellDateTime from "@/shared/components/dataGrid/cells/CellDateTime";
import CellFrequency from "@/shared/components/dataGrid/cells/CellFrequency";
import { GridColDef } from "@mui/x-data-grid";

export const getRowId = (row: TypeTblCompJob) => row.compJobId;
export const columns: GridColDef<TypeTblCompJob>[] = [
  {
    field: "compNo",
    headerName: "Component",
    flex: 2,
    valueGetter: (value, row) => row.tblComponentUnit?.compNo,
  },

  {
    field: "compTypeName",
    headerName: "CompType",
    flex: 1,
    // @ts-ignore
    valueGetter: (value, row) => row.tblComponentUnit?.tblCompType.compName,
  },

  {
    field: "jobCode",
    headerName: "Job Code",
    width: 100,
    valueGetter: (value, row) => row.tblJobDescription?.jobDescCode,
  },

  {
    field: "jobTitle",
    headerName: "Job Title",
    flex: 1,
    valueGetter: (value, row) => row.tblJobDescription?.jobDescTitle,
  },

  {
    field: "discipline",
    headerName: "Discipline",
    width: 100,
    valueGetter: (value, row) => row.tblDiscipline?.name,
  },

  {
    field: "frequency",
    headerName: "Frequency",
    renderCell: ({ row, value }) => (
      <CellFrequency frequency={value} frequencyPeriod={row.tblPeriod} />
    ),
  },

  {
    field: "lastDone",
    headerName: "Last Done",
    width: 150,
    renderCell: ({ value }) => <CellDateTime value={value} />,
  },
  {
    field: "nextDueDate",
    headerName: "Next Due Date",
    width: 150,
    renderCell: ({ value }) => <CellDateTime value={value} />,
  },
];
