import CustomizedDataGrid from "@/shared/components/dataGrid/DataGrid";
import { useCallback, useEffect, useState } from "react";
import { useDataGrid } from "@/shared/hooks/useDataGrid";
import { columns, getRowId } from "./TabMeasurePointColumns";
import {
  tblCompJobMeasurePoint,
  tblCompMeasurePoint,
  tblWorkOrder,
  TypeTblMaintLog,
} from "@/core/api/generated/api";

type Props = {
  selected: TypeTblMaintLog;
};

const TabMeasures = ({ selected }: Props) => {
  if (!selected?.maintLogId) return;
  const [compJobId, setCompJobId] = useState<number | null>(null);

  useEffect(() => {
    const getWorkOrder = async () => {
      if (selected?.workOrderId) {
        const workOrder = await tblWorkOrder.getById(selected.workOrderId);
        setCompJobId(workOrder.compJobId);
      }
    };

    getWorkOrder();
  }, [selected.maintLogId]);

  const getAll = useCallback(
    () =>
      tblCompJobMeasurePoint.getAll({
        filter: {
          compJobId,
        },
        include: {
          tblCompMeasurePoint: {
            include: {
              tblCounterType: true,
              tblUnit: true,
            },
          },
        },
      }),
    [compJobId],
  );

  const { rows, loading, handleRefresh } = useDataGrid(
    getAll,
    tblCompMeasurePoint.deleteById,
    "compJobMeasurePointId",
    !!compJobId,
  );

  return (
    <>
      <CustomizedDataGrid
        disableAdd
        disableEdit
        showToolbar
        label={selected.tblComponentUnit?.compNo || "Measure Point"}
        rows={rows}
        columns={columns}
        loading={loading}
        onRefreshClick={handleRefresh}
        getRowId={getRowId}
      />
    </>
  );
};

export default TabMeasures;
