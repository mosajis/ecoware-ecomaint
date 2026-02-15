import CustomizedDataGrid from "@/shared/components/dataGrid/DataGrid";
import { useCallback, useState } from "react";
import { GridColDef } from "@mui/x-data-grid";
import { useDataGrid } from "@/shared/hooks/useDataGrid";
import { useAtomValue } from "jotai";
import { reportWorkAtom } from "../ReportWorkAtom";
import {
  tblCompJobMeasurePoint,
  tblCompMeasurePoint,
  TypeTblCompJobMeasurePoint,
} from "@/core/api/generated/api";
import { atomUser } from "@/pages/auth/auth.atom";
import StepMeasurePointsUpsert from "./StepMeasurePointsUpsert";

const getRowId = (row: TypeTblCompJobMeasurePoint) => row.compJobMeasurePointId;

const columns: GridColDef<TypeTblCompJobMeasurePoint>[] = [
  {
    field: "counterTypeName",
    headerName: "Measure Name",
    flex: 1,
    valueGetter: (_, row) =>
      // @ts-ignore
      row?.tblCompMeasurePoint?.tblCounterType?.name || "—",
  },
  {
    field: "currentValue",
    headerName: "Current Value",
    flex: 1,
    align: "left",
    valueGetter: (_, row) =>
      // @ts-ignore
      row?.tblCompMeasurePoint?.currentValue ?? "—",
  },
  {
    field: "unitName",
    headerName: "Unit",
    flex: 1,
    // @ts-ignore
    valueGetter: (_, row) => row?.tblCompMeasurePoint?.tblUnit?.name || "—",
  },
];

const TabMeasures = () => {
  const { workOrder, maintLog } = useAtomValue(reportWorkAtom);
  const [selectedRow, setSelectedRow] =
    useState<TypeTblCompJobMeasurePoint | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const user = useAtomValue(atomUser);
  const userId = user?.userId as number;
  const compJobId = workOrder?.tblCompJob?.compJobId;

  const getAll = useCallback(
    () =>
      tblCompJobMeasurePoint.getAll({
        filter: {
          // compJobId,
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
        disableAdd
        label="Component Measures"
        rows={rows}
        columns={columns}
        loading={loading}
        onRefreshClick={handleRefresh}
        onEditClick={handleEdit}
        onDoubleClick={handleEdit}
        getRowId={getRowId}
      />

      <StepMeasurePointsUpsert
        open={dialogOpen}
        row={selectedRow!}
        maintLogDate={maintLog?.dateDone}
        userId={userId}
        onClose={handleCloseDialog}
        onSuccess={handleSuccess}
      />
    </>
  );
};

export default TabMeasures;
