import DataGrid from "@/shared/components/dataGrid/DataGrid";
import DailyReportUpsert from "./DailyReportUpsert";
import DailyReportActions from "./DailyReportActions";
import DailyReportDialogPrint from "./DailyReportDialogPrint";
import { useCallback, useState } from "react";
import { useDataGrid } from "@/shared/hooks/useDataGrid";
import { useUpsertDialog } from "@/shared/hooks/useUpsertDialog";
import { columns, getRowId } from "./DailyReportColumns";
import {
  tblDailyReport,
  TypeTblDailyReport,
  TypeTblDiscipline,
} from "@/core/api/generated/api";
import { useDialogs } from "@/shared/hooks/useDialogs";
import DailyReportFilterDialog, {
  DailyReportFilter,
} from "./DailyReportDialogFilter";
import { useAtomValue } from "jotai";
import { atomUser } from "@/pages/auth/auth.atom";
import { daysAgo } from "@/core/helper";

export default function PageDailyReport() {
  const [selectedRowId, setSelectedRowId] = useState<number | null>(null);

  const { dialogs, openDialog, closeDialog } = useDialogs({
    print: false,
    filter: false,
  });

  const user = useAtomValue(atomUser);

  const [filter, setFilter] = useState<DailyReportFilter | null>(null);
  const disipline = user?.tblEmployee?.tblDiscipline as TypeTblDiscipline;

  const getAll = useCallback(() => {
    return tblDailyReport.getAll({
      filter: filter ?? {
        AND: [
          {
            discId: disipline.discId,
          },
          {
            reportDate: {
              gte: new Date(daysAgo(14)),
              lte: new Date(),
            },
          },
        ],
      },
      include: {
        tblDiscipline: true,
      },
    });
  }, [filter]);

  const { rows, loading, handleRefresh, handleDelete } = useDataGrid(
    getAll,
    tblDailyReport.deleteById,
    "dailyReportId",
    !dialogs.filter,
  );

  const selectedRow =
    rows.find((x) => x.dailyReportId === selectedRowId) ?? null;

  const { openCreate, openEdit, openView, dialogProps } =
    useUpsertDialog<TypeTblDailyReport>({
      onSuccess: handleRefresh,
    });

  const handleRowClick = useCallback(({ row }: { row: TypeTblDailyReport }) => {
    setSelectedRowId(row.dailyReportId);
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
        onView={openView}
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
