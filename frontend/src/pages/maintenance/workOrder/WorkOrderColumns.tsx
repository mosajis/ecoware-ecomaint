import CellWorkOrderStatus from "./customCell/CellWorkOrderStatus";
import CellDateTime from "@/shared/components/dataGrid/cells/CellDateTime";
import CellOverdue from "./customCell/CellWorkOrderOverDue";
import { GridColDef } from "@mui/x-data-grid";
import { calculateOverdue } from "@/core/helper";
import { TypeTblWorkOrder } from "@/core/api/generated/api";

export const columns: GridColDef<TypeTblWorkOrder>[] = [
  {
    field: "workOrderId",
    headerName: "No",
    width: 90,
  },
  {
    field: "jobCode",
    headerName: "Job Code",
    width: 100,
    valueGetter: (_, row) => row?.tblCompJob?.tblJobDescription?.jobDescCode,
  },
  {
    field: "component",
    headerName: "Component",
    width: 250,
    valueGetter: (_, row) => row.tblComponentUnit?.compNo,
  },
  {
    field: "location",
    headerName: "Location",
    width: 150,
    valueGetter: (_, row) => row?.tblComponentUnit?.tblLocation?.name,
  },
  {
    field: "jobDescTitle",
    headerName: "Job Desc",
    width: 250,
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

export const getRowId = (row: TypeTblWorkOrder) => row.workOrderId;
