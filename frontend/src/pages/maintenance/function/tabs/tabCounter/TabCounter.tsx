import CustomizedDataGrid from "@/shared/components/dataGrid/DataGrid";
import { useCallback } from "react";
import { useDataGrid } from "@/shared/hooks/useDataGrid";
import { tblCompCounter, TypeTblFunction } from "@/core/api/generated/api";
import { columns, getRowId } from "./TabCounterColumn";

interface Props {
  recordFunction?: TypeTblFunction;
  label?: string;
}

const TabCounter = ({ recordFunction, label }: Props) => {
  const compId = recordFunction?.tblComponentUnit?.compId;

  const getAll = useCallback(() => {
    return tblCompCounter.getAll({
      include: {
        tblCounterType: true,
      },
      filter: {
        compId,
      },
    });
  }, [compId]);

  const { rows, loading, handleRefresh } = useDataGrid(
    getAll,
    tblCompCounter.deleteById,
    "compCounterId",
    !!compId,
  );

  return (
    <CustomizedDataGrid
      disableRowSelectionOnClick
      disableRowNumber
      disableAdd
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

export default TabCounter;
