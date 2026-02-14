import ReportWorkStep from "../ReportWorkStep";
import CustomizedDataGrid from "@/shared/components/dataGrid/DataGrid";
import { useCallback } from "react";
import { GridColDef } from "@mui/x-data-grid";
import { useDataGrid } from "@/shared/hooks/useDataGrid";
import {
  tblCompMeasurePoint,
  type TypeTblCompMeasurePoint,
} from "@/core/api/generated/api";
import { useAtomValue } from "jotai";
import { atomInitalData } from "../ReportWorkAtom";

interface TabMaintLogProps {
  onFinish?: (workOrderId: number) => void;
  compUnitId?: number | null;
  label?: string | null;
}

const columns: GridColDef<TypeTblCompMeasurePoint>[] = [
  {
    field: "counterTypeName",
    headerName: "Measure Name",
    flex: 1.4,
    valueGetter: (_, row) => row.tblCounterType?.name || "—",
  },
  {
    field: "unitName",
    headerName: "Unit",
    flex: 1,
    valueGetter: (_, row) => row.tblUnit?.name || "—",
  },
  {
    field: "currentValue",
    headerName: "Current Value",
    flex: 1,
    align: "right",
    headerAlign: "right",
  },
  {
    field: "setValue",
    headerName: "Set Value",
    flex: 1,
    align: "right",
    headerAlign: "right",
  },
  {
    field: "operationalMinValue",
    headerName: "Min (Operational)",
    flex: 1,
    align: "right",
    headerAlign: "right",
  },
  {
    field: "operationalMaxValue",
    headerName: "Max (Operational)",
    flex: 1,
    align: "right",
    headerAlign: "right",
  },
  {
    field: "lastupdate",
    headerName: "Last Update",
    flex: 1.1,
    valueFormatter: (value) =>
      value ? new Date(value as string).toLocaleString() : "—",
  },
  {
    field: "changedBy",
    headerName: "Changed By",
    flex: 1,
    valueGetter: (_, row) =>
      row.tblUsers?.fullName || row.tblUsers?.username || "—",
  },
];

const TabMeasures = ({ compUnitId, onFinish }: TabMaintLogProps) => {
  const maintLog = useAtomValue(atomInitalData).maintLog;
  const workOrderId = maintLog?.workOrderId;

  const handleFinish = useCallback(() => {
    if (onFinish) {
      onFinish(workOrderId);
    }
  }, [onFinish]);

  const getAll = useCallback(
    () =>
      tblCompMeasurePoint.getAll({
        filter: {
          compId: compUnitId,
        },
        include: {
          tblCounterType: true,
          tblUnit: true,
        },
      }),
    [compUnitId],
  );

  const { rows, loading, handleRefresh } = useDataGrid(
    getAll,
    tblCompMeasurePoint.deleteById,
    "compMeasurePointId",
    !!compUnitId,
  );

  return (
    <ReportWorkStep onFinish={handleFinish}>
      <CustomizedDataGrid
        label="Component Measures"
        rows={rows}
        columns={columns}
        loading={loading}
        showToolbar
        onRefreshClick={handleRefresh}
        getRowId={(row) => row.compMeasurePointId}
      />
    </ReportWorkStep>
  );
};

export default TabMeasures;
