import CellDateTime from "@/shared/components/dataGrid/cells/CellDateTime";
import { TypeTblMaintLog } from "@/core/api/generated/api";
import { GridColDef } from "@mui/x-data-grid";

export const columns: GridColDef<TypeTblMaintLog>[] = [
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
    // @ts-ignore
    valueGetter: (_, row) => row?.tblWorkOrder?.tblDiscipline?.name,
  },
  {
    field: "followStatus",
    headerName: "Follow Status",
    valueGetter: (_, row) => row?.tblFollowStatus?.fsName,
  },
  {
    field: "maintClass",
    headerName: "Maint Class",
    valueGetter: (_, row) => row?.tblMaintClass?.descr ?? "",
  },
  {
    field: "downTime",
    headerName: "DownTime",
    renderCell: ({ value }) => <CellDateTime value={value} />,
  },

  {
    field: "unplanned",
    headerName: "Unplanned",
    type: "boolean",
    width: 95,
  },
];
