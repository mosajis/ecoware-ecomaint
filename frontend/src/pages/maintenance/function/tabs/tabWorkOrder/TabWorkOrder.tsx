import CustomizedDataGrid from "@/shared/components/dataGrid/DataGrid";
import { useCallback } from "react";
import { useDataGrid } from "@/shared/hooks/useDataGrid";
import { tblWorkOrder, TypeTblFunctions } from "@/core/api/generated/api";
import { columns, getRowId } from "./TabWorkOrderColumn";

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
        tblWorkOrderStatus: {
          workOrderStatusId: { notIn: [5, 6] },
        },
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
