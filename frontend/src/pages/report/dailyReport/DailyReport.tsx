import DataGrid from "@/shared/components/dataGrid/DataGrid";
import DailyReportUpsert from "./DailyReportUpsert";

import { useCallback } from "react";
import { useDataGrid } from "@/shared/hooks/useDataGrid";
import { useUpsertDialog } from "@/shared/hooks/useUpsertDialog";
import { columns, getRowId } from "./DailyReportColumns";
import { tblDailyReport, TypeTblDailyReport } from "@/core/api/generated/api";

export default function PageDailyReport() {
  const getAll = useCallback(
    () =>
      tblDailyReport.getAll({
        include: {},
      }),
    [],
  );

  const { rows, loading, handleRefresh, handleDelete } = useDataGrid(
    getAll,
    tblDailyReport.deleteById,
    "dailyReportId",
  );

  const { openCreate, openEdit, openView, dialogProps } =
    useUpsertDialog<TypeTblDailyReport>({
      onSuccess: handleRefresh,
    });

  return (
    <>
      <DataGrid
        showToolbar
        disableRowNumber
        elementId={0}
        label="Daily Report"
        loading={loading}
        rows={rows}
        columns={columns}
        getRowId={getRowId}
        onRefreshClick={handleRefresh}
        onAddClick={openCreate}
        onEditClick={openEdit}
        onDoubleClick={openView}
        onDeleteClick={handleDelete}
      />

      <DailyReportUpsert entityName="DailyReport" {...dialogProps} />
    </>
  );
}
