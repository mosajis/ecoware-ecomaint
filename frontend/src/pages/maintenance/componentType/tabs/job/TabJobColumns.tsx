import { TypeTblCompTypeJob } from "@/core/api/generated/api";
import CellDateTime from "@/shared/components/dataGrid/cells/CellDateTime";
import CellFrequency from "@/shared/components/dataGrid/cells/CellFrequency";
import { GridColDef } from "@mui/x-data-grid";

export const getRowId = (row: TypeTblCompTypeJob) => row.compTypeJobId;

export const columns: GridColDef<TypeTblCompTypeJob>[] = [
  {
    field: "jobCode",
    headerName: "Code",
    width: 90,
    valueGetter: (_, row) => row.tblJobDescription?.jobDescCode,
  },
  {
    field: "jobName",
    headerName: "Title",
    flex: 2.5,
    valueGetter: (_, row) => row.tblJobDescription?.jobDescTitle,
  },
  {
    field: "frequency",
    headerName: "Frequency",
    renderCell: ({ row, value }) => (
      <CellFrequency frequency={value} frequencyPeriod={row.tblPeriod} />
    ),
  },
  {
    field: "discipline",
    headerName: "Discipline",
    flex: 1,
    valueGetter: (_, row) => row.tblDiscipline?.name,
  },
  {
    field: "maintClass",
    headerName: "MaintClass",
    flex: 1,
    valueGetter: (_, row) => row.tblMaintClass?.descr,
  },
  {
    field: "maintType",
    headerName: "MaintType",
    flex: 1,
    valueGetter: (_, row) => row.tblMaintType?.descr,
  },
  {
    field: "maintCause",
    headerName: "MaintCause",
    flex: 1,
    valueGetter: (_, row) => row.tblMaintCause?.descr,
  },
  {
    field: "priority",
    headerName: "Priority",
    width: 75,
  },
  {
    field: "window",
    headerName: "Window",
    width: 75,
  },
  {
    field: "planningMethod",
    headerName: "Method",
    width: 90,
    valueGetter: (_, row) => (row.planningMethod ? "Fixed" : "Variable"),
  },
  { field: "statusNone", headerName: "St-None", width: 85, type: "boolean" },
  { field: "statusInUse", headerName: "St-InUse", width: 85, type: "boolean" },
  {
    field: "statusAvailable",
    headerName: "St-Available",
    width: 95,
    type: "boolean",
  },
  {
    field: "statusRepair",
    headerName: "St-Repair",
    width: 90,
    type: "boolean",
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
