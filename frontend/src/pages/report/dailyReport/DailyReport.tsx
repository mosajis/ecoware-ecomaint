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
import DailyReportFilterDialog, {
  DailyReportFilter,
} from "./DailyReportDialogFilter";

export default function PageDailyReport() {
  const [selectedRow, setSelectedRow] = useState<TypeTblDailyReport | null>(
    null,
  );

  const { dialogs, openDialog, closeDialog } = useDialogs({
    print: false,
    filter: true,
  });

  const [filter, setFilter] = useState<DailyReportFilter | null>(null);

  const getAll = useCallback(() => {
    return tblDailyReport.getAll({
      filter: filter ?? undefined,
      include: {
        tblDiscipline: true,
      },
    });
  }, [filter]);

  const { rows, loading, handleRefresh, handleDelete } = useDataGrid(
    getAll,
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

  const handleSubmitFilter = useCallback(
    (f: DailyReportFilter | null) => {
      setFilter(f);
      closeDialog("filter");
    },
    [closeDialog],
  );

  const hasFilter = Array.isArray(filter?.AND) && filter.AND.length > 0;

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
            onFilter={() => openDialog("filter")}
            onPrint={() => openDialog("print")}
            hasFilter={hasFilter}
            selected={selectedRow}
          />
        }
      />

      <DailyReportFilterDialog
        open={dialogs.filter}
        onClose={() => closeDialog("filter")}
        onSubmit={handleSubmitFilter}
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
