import CellWorkOrderStatus from "./customCell/CellWorkOrderStatus";
import CellDateTime from "@/shared/components/dataGrid/cells/CellDateTime";
import CellOverdue from "./customCell/CellWorkOrderOverDue";
import { GridColDef } from "@mui/x-data-grid";
import { TypeTblWorkOrderWithRels } from "./types";
import { calculateOverdue } from "@/core/helper";

export const columns: GridColDef<TypeTblWorkOrderWithRels>[] = [
  {
    field: "workOrderId",
    headerName: "WO.NO",
    width: 90,
    valueFormatter: (value) => "WO-" + value,
  },
  {
    field: "jobCode",
    headerName: "Job Code",
    width: 90,
    valueGetter: (_, row) => row?.tblCompJob?.tblJobDescription?.jobDescCode,
  },
  {
    field: "component",
    headerName: "Component",
    flex: 1,
    valueGetter: (_, row) => row.tblComponentUnit?.compNo,
  },
  {
    field: "location",
    headerName: "Location",
    flex: 1,
    valueGetter: (_, row) => row?.tblComponentUnit?.tblLocation?.name,
  },
  {
    field: "jobDescTitle",
    headerName: "Job Desc",
    flex: 1,
    valueGetter: (_, row) => row?.tblCompJob?.tblJobDescription?.jobDescTitle,
  },
  {
    field: "discipline",
    headerName: "Discipline",
    width: 90,
    valueGetter: (_, row) => row?.tblDiscipline?.name,
  },
  {
    field: "status",
    headerName: "Status",
    width: 101,
    valueGetter: (_, row) => row?.tblWorkOrderStatus?.name,
    renderCell: (params) => <CellWorkOrderStatus status={params.value} />,
  },
  {
    field: "dueDate",
    headerName: "Due Date",
    width: 95,
    renderCell: ({ value }) => <CellDateTime value={value} type="DATE" />,
  },
  {
    field: "completed",
    headerName: "Completed",
    width: 95,
    renderCell: ({ value }) => <CellDateTime value={value} type="DATE" />,
  },
  {
    field: "overDue",
    headerName: "OverDue",
    width: 80,
    valueGetter: (_, row) => calculateOverdue(row),
    renderCell: (params) => <CellOverdue value={params.value} />,
  },
  {
    field: "pendingType",
    headerName: "Pending Type",
    width: 120,
    valueGetter: (_, row) => row?.tblPendingType?.pendTypeName,
  },
  {
    field: "priority",
    headerName: "Priority",
    width: 70,
  },
];
