import CustomizedDataGrid from "@/shared/components/dataGrid/DataGrid";
import { useDataGrid } from "@/shared/hooks/useDataGrid";
import { columns } from "../../workOrder/WorkOrderColumns";
import { useCallback } from "react";
import {
  tblWorkOrder,
  TypeTblComponentUnit,
  TypeTblWorkOrder,
} from "@/core/api/generated/api";

interface Props {
  componentUnit?: TypeTblComponentUnit;
  label?: string;
}

const getRowId = (row: TypeTblWorkOrder) => row.workOrderId;

const TabWorkOrder = ({ componentUnit, label }: Props) => {
  const compId = componentUnit?.compId;

  const getAll = useCallback(
    () =>
      tblWorkOrder.getAll({
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
      }),
    [],
  );

  const { rows, loading, handleRefresh } = useDataGrid(
    getAll,
    tblWorkOrder.deleteAll,
    "workOrderId",
    !!compId,
  );

  return (
    <CustomizedDataGrid
      disableEdit
      disableDelete
      disableRowNumber
      disableRowSelectionOnClick
      label={label}
      showToolbar={!!label}
      rows={rows}
      columns={columns}
      loading={loading}
      onRefreshClick={handleRefresh}
      getRowId={getRowId}
    />
  );
};

export default TabWorkOrder;
