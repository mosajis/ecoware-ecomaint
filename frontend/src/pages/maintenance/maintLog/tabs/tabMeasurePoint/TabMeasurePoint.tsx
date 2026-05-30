import CustomizedDataGrid from "@/shared/components/dataGrid/DataGrid";
import TabMeasurePointUpsert from "./TabMeasurePointUpsert";
import { useCallback, useEffect, useState } from "react";
import { useDataGrid } from "@/shared/hooks/useDataGrid";
import { atomUser } from "@/pages/auth/auth.atom";
import { columns, getRowId } from "./TabMeasurePointColumns";
import { useAtomValue } from "jotai";
import {
  tblCompJobMeasurePoint,
  tblCompMeasurePoint,
  tblWorkOrder,
  TypeTblCompJobMeasurePoint,
  TypeTblMaintLog,
} from "@/core/api/generated/api";

type Props = {
  selected: any;
};

const TabMeasures = ({ selected }: Props) => {
  if (!selected.maintLogId) return;

  const [selectedRow, setSelectedRow] =
    useState<TypeTblCompJobMeasurePoint | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const [compJobId, setCompJobId] = useState<number | null>(null);

  useEffect(() => {
    const getWorkOrder = async () => {
      const workOrder = await tblWorkOrder.getById(selected.workOrderId);
      setCompJobId(workOrder.compJobId);
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

  const { rows, loading, handleRefresh, optimisticUpdate } = useDataGrid(
    getAll,
    tblCompMeasurePoint.deleteById,
    "compJobMeasurePointId",
    !!compJobId,
  );

  const handleEdit = useCallback(
    (rowId: number) => {
      const row = rows.find((r) => r.compJobMeasurePointId === rowId);
      if (row) {
        setSelectedRow(row);
        setDialogOpen(true);
      }
    },
    [rows],
  );

  const handleCloseDialog = useCallback(() => {
    setDialogOpen(false);
    setSelectedRow(null);
  }, []);

  const handleSuccess = useCallback(
    (newValue: number, currentDate: string) => {
      if (!selectedRow) return;

      optimisticUpdate(selectedRow.compJobMeasurePointId, {
        tblCompMeasurePoint: selectedRow.tblCompMeasurePoint
          ? {
              ...selectedRow.tblCompMeasurePoint,
              currentValue: newValue,
              currentDate: currentDate,
            }
          : selectedRow.tblCompMeasurePoint,
      } as any);
    },
    [selectedRow, optimisticUpdate],
  );

  return (
    <>
      <CustomizedDataGrid
        showToolbar
        label="Component Measures"
        rows={rows}
        columns={columns}
        loading={loading}
        onRefreshClick={handleRefresh}
        onEditClick={handleEdit}
        onDoubleClick={handleEdit}
        getRowId={getRowId}
      />

      <TabMeasurePointUpsert
        open={dialogOpen}
        row={selectedRow!}
        onClose={handleCloseDialog}
        onSuccess={handleSuccess}
      />
    </>
  );
};

export default TabMeasures;
