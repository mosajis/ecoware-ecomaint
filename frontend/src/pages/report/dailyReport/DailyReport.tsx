import DataGrid from "@/shared/components/dataGrid/DataGrid";
import DailyReportUpsert from "./DailyReportUpsert";
import DailyReportActions from "./DailyReportActions";
import DailyReportDialogPrint from "./DailyReportDialogPrint";
import { useCallback, useState } from "react";
import { useDataGrid } from "@/shared/hooks/useDataGrid";
import { useUpsertDialog } from "@/shared/hooks/useUpsertDialog";
import { columns, getRowId } from "./DailyReportColumns";
import { tblDailyReport, TypeTblDailyReport } from "@/core/api/generated/api";
import { useDialogs } from "@/shared/hooks/useDialogs";

export default function PageDailyReport() {
  const [selectedRow, setSelectedRow] = useState<TypeTblDailyReport | null>(
    null,
  );

  const { dialogs, openDialog, closeDialog } = useDialogs({
    print: false,
  });

  const { rows, loading, handleRefresh, handleDelete } = useDataGrid(
    tblDailyReport.getAll,
    tblDailyReport.deleteById,
    "dailyReportId",
  );

  const { openCreate, openEdit, openView, dialogProps } =
    useUpsertDialog<TypeTblDailyReport>({
      onSuccess: handleRefresh,
    });

  const handleRowClick = useCallback(({ row }: { row: TypeTblDailyReport }) => {
    setSelectedRow(row);
  }, []);

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
        onRowClick={handleRowClick}
        getRowId={getRowId}
        onRefreshClick={handleRefresh}
        onAddClick={openCreate}
        onEditClick={openEdit}
        onDoubleClick={openView}
        onDeleteClick={handleDelete}
        toolbarChildren={
          <DailyReportActions
            onPrint={() => openDialog("print")}
            selected={selectedRow}
          />
        }
      />

      <DailyReportUpsert entityName="DailyReport" {...dialogProps} />

      {dialogs.print && (
        <DailyReportDialogPrint
          open={dialogs.print}
          onClose={() => closeDialog("print")}
          selectedRow={selectedRow}
        />
      )}
    </>
  );
}
