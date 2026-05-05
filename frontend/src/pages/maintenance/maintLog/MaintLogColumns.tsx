import CellDateTime from "@/shared/components/dataGrid/cells/CellDateTime";
import { TypeTblMaintLog } from "@/core/api/generated/api";
import { GridColDef } from "@mui/x-data-grid";

export const getRowId = (row: TypeTblMaintLog) => row.maintLogId;

export const columns: GridColDef<TypeTblMaintLog>[] = [
  {
    field: "id",
    headerName: "id",
    flex: 1,
    valueGetter: (_, row) => row?.maintLogId,
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
    field: "downTime",
    headerName: "DownTime",
    flex: 1,
  },
];
