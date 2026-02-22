import CustomizedDataGrid from "@/shared/components/dataGrid/DataGrid";
import { useCallback } from "react";
import { columns, getRowId } from "./TabMeasurePointColumns";
import { useDataGrid } from "@/shared/hooks/useDataGrid";
import {
  tblCompMeasurePoint,
  tblCompTypeMeasurePoint,
  TypeTblMaintLog,
} from "@/core/api/generated/api";

type Props = {
  selected: TypeTblMaintLog;
  label?: string;
};
// maintLogMeasurepoint
const TabMeasurePoints = ({ selected }: Props) => {
  const compId = selected?.tblComponentUnit?.compId;
  // === getAll callback ===
  const getAll = useCallback(() => {
    return tblCompMeasurePoint.getAll({
      filter: {
        compId,
      },
      include: {
        tblUnit: true,
        tblCounterType: true,
      },
    });
  }, [compId]);

  // === useDataGrid ===
  const { rows, loading, handleRefresh } = useDataGrid(
    getAll,
    tblCompTypeMeasurePoint.deleteById,
    "compMeasurePointId",
    !!compId,
  );

  return (
    <CustomizedDataGrid
      label="Measures"
      showToolbar
      disableAdd
      disableEdit
      disableRowSelectionOnClick
      disableDelete
      rows={rows}
      columns={columns}
      loading={loading}
      onRefreshClick={handleRefresh}
      getRowId={getRowId}
    />
  );
};

export default TabMeasurePoints;
