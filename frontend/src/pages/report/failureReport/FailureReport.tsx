import DataGrid from "@/shared/components/dataGrid/DataGrid";
import Splitter from "@/shared/components/Splitter/Splitter";
import Tabs from "./FailureReportTabs";
import FailureReportUpsert from "./FailureReportUpsert";
import FailureReportActions from "./FailureReportActions";
import FailureReportDialogClose from "./FailureReportDialogClose";
import FailureReportDialogOpen from "./FailureReportDialogOpen";
import FailureReportDialogFilter from "./FailureReportDialogFilter";
import FailureReportDialogPrint from "./FailureReportDialogPrint";

import { useCallback, useMemo, useState } from "react";
import { FailureReportFilter } from "./FailureReportDialogFilter";
import { useDataGrid } from "@/shared/hooks/useDataGrid";
import { useUpsertDialog } from "@/shared/hooks/useUpsertDialog";
import { columns, getRowId } from "./FailureReportColumns";
import { useDialogs } from "@/shared/hooks/useDialogs";

import {
  tblFailureReport,
  TypeTblFailureReport,
} from "@/core/api/generated/api";

export default function PagefailureReport() {
  const [filter, setFilter] = useState<FailureReportFilter | null>(null);
  const [selectedRowId, setSelectedRowId] = useState<number | null>(null);

  const { dialogs, closeDialog, openDialog } = useDialogs({
    filter: true,
    close: false,
    open: false,
    print: false,
  });

  const getAll = useCallback(
    () =>
      tblFailureReport.getAll({
        filter: filter ?? undefined,
        include: {
          tblMaintLog: {
            include: {
              tblEmployee: true,
              tblComponentUnit: true,
              tblMaintCause: true,
              tblDiscipline: true,
            },
          },
          tblFailureSeverityLevel: true,
          tblFailureStatus: true,
          tblFailureGroupFollow: true,
          tblEmployee: true,
        },
      }),
    [filter],
  );

  const { rows, loading, handleRefresh, handleDelete } = useDataGrid(
    getAll,
    tblFailureReport.deleteById,
    "failureReportId",
    !dialogs.filter,
  );

  const { openCreate, openEdit, openView, dialogProps } =
    useUpsertDialog<TypeTblFailureReport>({
      onSuccess: handleRefresh,
    });

  const handleRowClick = ({ row }: { row: TypeTblFailureReport }) => {
    setSelectedRowId((prev) =>
      prev === row.failureReportId ? null : row.failureReportId,
    );
  };

  const selectedRow =
    rows.find((r) => r.failureReportId === selectedRowId) || null;

  const hasFilter = Array.isArray(filter?.AND) && filter.AND.length > 0;

  const toolbar = useMemo(
    () => (
      <FailureReportActions
        hasFilter={hasFilter}
        selectedRow={selectedRow}
        onFilter={() => openDialog("filter")}
        onClose={() => openDialog("close")}
        onOpen={() => openDialog("open")}
        onPrint={() => openDialog("print")}
      />
    ),
    [selectedRow, hasFilter],
  );

  const handleFilterSubmit = (newFilter: FailureReportFilter | null) => {
    setFilter(newFilter);
    closeDialog("filter");
  };

  return (
    <>
      <Splitter horizontal initialPrimarySize="65%">
        <DataGrid
          showToolbar
          disableRowNumber
          label="Failure Report"
          loading={loading}
          rows={rows}
          columns={columns}
          getRowId={getRowId}
          onRowClick={handleRowClick}
          onRefreshClick={handleRefresh}
          onAddClick={openCreate}
          onEditClick={openEdit}
          onDoubleClick={openView}
          onDeleteClick={handleDelete}
          toolbarChildren={toolbar}
        />

        <Tabs failreReport={selectedRow!} />
      </Splitter>

      <FailureReportUpsert entityName="FailureReport" {...dialogProps} />

      <FailureReportDialogClose
        open={dialogs.close}
        failureReportId={selectedRow?.failureReportId!}
        onClose={() => closeDialog("close")}
        onSuccess={handleRefresh}
      />

      <FailureReportDialogOpen
        open={dialogs.open}
        failureReportId={selectedRow?.failureReportId!}
        onClose={() => closeDialog("open")}
        onSuccess={handleRefresh}
      />

      <FailureReportDialogFilter
        open={dialogs.filter}
        onClose={() => closeDialog("filter")}
        onSubmit={handleFilterSubmit}
      />

      <FailureReportDialogPrint
        failureReportId={selectedRow?.failureReportId!}
        onClose={() => closeDialog("print")}
        open={dialogs.print}
      />
    </>
  );
}
