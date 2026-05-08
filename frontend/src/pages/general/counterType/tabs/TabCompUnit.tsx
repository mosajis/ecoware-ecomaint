import CustomizedDataGrid from "@/shared/components/dataGrid/DataGrid";
import { useCallback } from "react";
import { tblCompCounter } from "@/core/api/generated/api";

import { useDataGrid } from "@/shared/hooks/useDataGrid";
import { columns, getRowId } from "./TabCompUnitColumn";

interface Props {
  counterTypeId: number | null | undefined;
  label?: string;
}

export default function TabCompUnitCounter(props: Props) {
  const { counterTypeId, label } = props;

  const getAll = useCallback(() => {
    return tblCompCounter.getAll({
      filter: { counterTypeId },
      include: {
        tblComponentUnit: {
          include: {
            tblCompType: true,
            tblCompStatus: true,
          },
        },
      },
    });
  }, [counterTypeId]);

  const { rows, loading, handleRefresh } = useDataGrid(
    getAll,
    tblCompCounter.deleteById,
    "compCounterId",
    !!counterTypeId,
  );

  return (
    <CustomizedDataGrid
      disableEdit
      disableDelete
      disableRowSelectionOnClick
      rows={rows}
      columns={columns}
      loading={loading}
      label={label}
      showToolbar={!!label}
      onRefreshClick={handleRefresh}
      getRowId={getRowId}
    />
  );
}
