import CustomizedDataGrid from "@/shared/components/dataGrid/DataGrid";
import Splitter from "@/shared/components/Splitter/Splitter";
import AttachmentMap from "@/shared/tabs/attachmentMap/AttachmentMap";
import FailureReportUpsert from "./ReportFailureUpsert";
import FailureReportActions from "./ReportFailureActions";
import ReportFailureDialogClose from "./ReportFailureDialogClose";
import ReportFailureDialogOpen from "./ReportFailureDialogOpen";
import FailureReportDialogFilter from "./ReportFailureDialogFilter";
import { useCallback, useMemo, useState } from "react";
import { FailureReportFilter } from "./ReportFailureDialogFilter";
import { useDataGrid } from "@/shared/hooks/useDataGrid";
import { columns } from "./ReportFailureColumns";
import {
  tblFailureReportAttachment,
  tblFailureReports,
  TypeTblFailureReports,
} from "@/core/api/generated/api";

const getRowId = (row: TypeTblFailureReports) => row.failureReportId;

export default function PageReportFailure() {
  const [selectedRowId, setSelectedRowId] = useState<number | null>(null);
  const [selectedLabel, setSelectedLabel] = useState<string | null>(null);
  const [mode, setMode] = useState<"create" | "update">("create");
  const [filter, setFilter] = useState<FailureReportFilter | null>(null);
  const [dialogs, setDialogs] = useState({
    form: false,
    filter: true,
    close: false,
    open: false,
  });

  const getAll = useCallback(
    () =>
      tblFailureReports.getAll({
        filter: filter ?? undefined,
        include: {
          tblMaintLog: {
            include: {
              tblUsersTblMaintLogReportedByTotblUsers: true,
              tblComponentUnit: true,
              tblMaintCause: true,
              tblDiscipline: true,
            },
          },
          tblFailureSeverityLevel: true,
          tblFailureStatus: true,
          tblFailureGroupFollow: true,
          tblUsers: true,
        },
      }),
    [filter],
  );

  const { rows, loading, handleRefresh, handleDelete, optimisticUpdate } =
    useDataGrid(
      getAll,
      tblFailureReports.deleteById,
      "failureReportId",
      !dialogs.filter,
    );

  const selectedRow =
    rows.find((r) => r.failureReportId === selectedRowId) || null;

  const openDialog = (key: keyof typeof dialogs) =>
    setDialogs((p) => ({ ...p, [key]: true }));

  const closeDialog = (key: keyof typeof dialogs) =>
    setDialogs((p) => ({ ...p, [key]: false }));

  const handleCreate = useCallback(() => {
    setSelectedRowId(null);
    setMode("create");
    openDialog("form");
  }, []);

  const handleEdit = useCallback((rowId: number) => {
    setSelectedRowId(rowId);
    setMode("update");
    openDialog("form");
  }, []);

  const handleRowClick = useCallback(
    ({ row }: { row: TypeTblFailureReports }) => {
      if (row.failureReportId === selectedRowId) {
        setSelectedRowId(null);
        setSelectedLabel(null);
        return;
      }
      setSelectedRowId(row.failureReportId);
      setSelectedLabel(row.title);
    },
    [selectedRowId],
  );

  const handleFilterSubmit = (newFilter: FailureReportFilter | null) => {
    setFilter(newFilter);
    closeDialog("filter");
  };

  const toolbar = useMemo(
    () => (
      <FailureReportActions
        selectedRow={selectedRow}
        onFilter={() => openDialog("filter")}
        onClose={() => openDialog("close")}
        onOpen={() => openDialog("open")}
        onPrint={() => {}}
      />
    ),
    [selectedRow],
  );

  return (
    <>
      <Splitter horizontal initialPrimarySize="65%">
        <CustomizedDataGrid
          showToolbar
          disableRowNumber
          label="Failure Report"
          loading={loading}
          rows={rows}
          columns={columns}
          getRowId={getRowId}
          onRefreshClick={handleRefresh}
          onAddClick={handleCreate}
          onEditClick={handleEdit}
          onDoubleClick={handleEdit}
          onDeleteClick={handleDelete}
          onRowClick={handleRowClick}
          toolbarChildren={toolbar}
        />
        <AttachmentMap
          label={selectedLabel || "Failure Attachments"}
          mapService={tblFailureReportAttachment}
          filterId={selectedRowId}
          filterKey="failureReportId"
          relName="tblFailureReports"
          tableId="failureReportAttachmentId"
        />
      </Splitter>

      <FailureReportUpsert
        open={dialogs.form}
        mode={mode}
        failureReportId={selectedRowId}
        onClose={() => closeDialog("form")}
        onSuccess={handleRefresh}
      />

      <ReportFailureDialogClose
        open={dialogs.close}
        failureReportId={selectedRowId}
        onClose={() => closeDialog("close")}
        onSuccess={(patch) => optimisticUpdate(selectedRowId!, patch)}
      />

      <ReportFailureDialogOpen
        open={dialogs.open}
        failureReportId={selectedRowId}
        onClose={() => closeDialog("open")}
        onSuccess={(patch) => optimisticUpdate(selectedRowId!, patch)}
      />

      <FailureReportDialogFilter
        open={dialogs.filter}
        onClose={() => closeDialog("filter")}
        onSubmit={handleFilterSubmit}
      />
    </>
  );
}
