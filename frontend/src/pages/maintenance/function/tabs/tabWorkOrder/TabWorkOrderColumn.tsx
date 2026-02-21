import OverdueText from "../../../workOrder/customCell/CellWorkOrderOverDue";
import StatusChip from "@/pages/maintenance/workOrder/customCell/CellWorkOrderStatus";
import { TypeTblWorkOrder } from "@/core/api/generated/api";
import { calculateOverdue, formatDateTime } from "@/core/helper";
import { TypeTblWorkOrderWithRels } from "@/pages/maintenance/workOrder/types";
import { GridColDef } from "@mui/x-data-grid";

export const getRowId = (row: TypeTblWorkOrder) => row.workOrderId;

export const columns: GridColDef<TypeTblWorkOrderWithRels>[] = [
  {
    field: "jobCode",
    headerName: "JobCode",
    width: 140,
    valueGetter: (_, row) => row?.tblCompJob?.tblJobDescription?.jobDescCode,
  },

  {
    field: "component",
    headerName: "Component",
    flex: 2,
    valueGetter: (_, row) => row.tblComponentUnit?.compNo,
  },
  {
    field: "location",
    headerName: "Location",
    width: 100,
    valueGetter: (_, row) => row?.tblComponentUnit?.tblLocation?.name,
  },
  {
    field: "jobDescTitle",
    headerName: "Job Desc",
    flex: 2,
    valueGetter: (_, row) => row?.tblCompJob?.tblJobDescription?.jobDescTitle,
  },
  {
    field: "discipline",
    headerName: "Discipline",
    width: 110,
    valueGetter: (_, row) => row?.tblDiscipline?.name,
  },

  {
    field: "status",
    headerName: "Status",
    width: 95,
    valueGetter: (_, row) => row?.tblWorkOrderStatus?.name,
    renderCell: (params) => <StatusChip status={params.value} />,
  },
  {
    field: "dueDate",
    headerName: "Due Date",
    width: 130,
    valueFormatter: (value) => (value ? formatDateTime(value) : ""),
  },
  {
    field: "completed",
    headerName: "Completed Date",
    width: 130,
    valueFormatter: (value) => (value ? formatDateTime(value) : ""),
  },
  {
    field: "overDue",
    headerName: "OverDue",
    width: 80,
    valueGetter: (_, row) => calculateOverdue(row),
    renderCell: (params) => <OverdueText value={params.value} />,
  },

  {
    field: "pendingType",
    headerName: "Pending Type",
    valueGetter: (_, row) => row?.tblPendingType?.pendTypeName,
  },
];
