import CustomizedDataGrid from "@/shared/components/dataGrid/DataGrid";
import { memo, useCallback, useMemo } from "react";
import { tblMaintLogStocks, TypeTblMaintLog } from "@/core/api/generated/api";
import { useDataGrid } from "@/shared/hooks/useDataGrid";
import { columns, getRowId } from "./TabStockUsedColumns";

type Props = {
  selected: TypeTblMaintLog;
  label?: string;
};

const TabStockUsed = (props: Props) => {
  const { selected, label } = props;

  const maintLogId = useMemo(
    () => selected?.maintLogId,
    [selected?.maintLogId],
  );

  const getAll = useCallback(() => {
    return tblMaintLogStocks.getAll({
      include: {
        tblSpareUnit: {
          include: {
            tblSpareType: true,
          },
        },
      },
      filter: {
        maintLogId: maintLogId,
      },
    });
  }, [maintLogId]);

  // === useDataGrid ===
  const { rows, loading } = useDataGrid(
    getAll,
    tblMaintLogStocks.deleteById,
    "maintLogStockId",
    !!maintLogId,
  );

  return (
    <CustomizedDataGrid
      showToolbar
      disableRowSelectionOnClick
      disableAdd
      disableEdit
      disableDelete
      loading={loading}
      label={label || "Stock Used"}
      rows={rows}
      columns={columns}
      getRowId={getRowId}
    />
  );
};

export default memo(TabStockUsed);
