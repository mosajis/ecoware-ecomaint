import StatusChip from "../../workOrder/customCell/CellWorkOrderStatus";
import OverdueText from "../../workOrder/customCell/CellWorkOrderOverDue";
import CustomizedDataGrid from "@/shared/components/dataGrid/DataGrid";
import { useCallback } from "react";
import { useDataGrid } from "@/shared/hooks/useDataGrid";
import { GridColDef } from "@mui/x-data-grid";
import { TypeTblWorkOrderWithRels } from "../../workOrder/types";
import { calculateOverdue, formatDateTime } from "@/core/helper";
import {
  tblWorkOrder,
  TypeTblFunctions,
  TypeTblWorkOrder,
} from "@/core/api/generated/api";

const getRowId = (row: TypeTblWorkOrder) => row.workOrderId;

const columns: GridColDef<TypeTblWorkOrderWithRels>[] = [
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

interface Props {
  recordFunction?: TypeTblFunctions;
  label?: string;
}

const TabWorkOrder = ({ recordFunction, label }: Props) => {
  const compId = recordFunction?.tblComponentUnit?.compId;

  const getAll = useCallback(() => {
    return tblWorkOrder.getAll({
      filter: {
        compId,
      },
      include: {
        tblComponentUnit: {
          include: {
            tblCompStatus: true,
            tblLocation: true,
          },
        },
        tblCompJob: {
          include: {
            tblJobDescription: true,
            tblPeriod: true,
          },
        },
        tblPendingType: true,
        tblDiscipline: true,
        tblWorkOrderStatus: true,
      },
    });
  }, [compId]);

  const { rows, loading, handleRefresh } = useDataGrid(
    getAll,
    tblWorkOrder.deleteAll,
    "workOrderId",
    !!compId,
  );

  return (
    <CustomizedDataGrid
      disableAdd
      disableRowSelectionOnClick
      disableEdit
      disableDelete
      showToolbar={!!label}
      label={label}
      rows={rows}
      columns={columns}
      loading={loading}
      onRefreshClick={handleRefresh}
      getRowId={getRowId}
    />
  );
};

export default TabWorkOrder;
