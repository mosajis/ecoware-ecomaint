import CustomizedDataGrid from "@/shared/components/dataGrid/DataGrid";
import { columns, getRowId } from "./CountersLogsColumns";
import { useCallback } from "react";
import { useDataGrid } from "@/shared/hooks/useDataGrid";
import {
  tblCompCounterLog,
  TypeTblCompCounterLog,
} from "@/core/api/generated/api";

export default function PageCounterLog() {
  const getAll = useCallback(
    () =>
      tblCompCounterLog.getAll({
        include: {
          tblCompCounter: {
            include: {
              tblCounterType: true,
              tblComponentUnit: {
                include: {
                  tblCompType: true,
                },
              },
            },
          },
        },
      }),
    [],
  );

  const { rows, loading, handleRefresh, handleDelete } =
    useDataGrid<TypeTblCompCounterLog>(
      getAll,
      tblCompCounterLog.deleteById,
      "compCounterLogId",
    );
  return (
    <CustomizedDataGrid
      showToolbar
      disableAdd
      disableEdit
      label="Counter Logs"
      rows={rows}
      columns={columns}
      loading={loading}
      onDeleteClick={handleDelete}
      onRefreshClick={handleRefresh}
      getRowId={getRowId}
    />
  );
}
