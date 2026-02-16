import CustomizedDataGrid from "@/shared/components/dataGrid/DataGrid";
import FailureReportUpsert from "./ReportFailureUpsert";
import Splitter from "@/shared/components/Splitter/Splitter";
import AttachmentMap from "@/shared/tabs/attachmentMap/AttachmentMap";
import FailureReportFilterDialog from "./ReportFailureDialogFilter";
import FailureReportActions from "./ReportFailureActions";
import { useCallback, useState } from "react";
import { useDataGrid } from "@/shared/hooks/useDataGrid";
import { FailureReportFilter } from "./ReportFailureDialogFilter";
import { columns } from "./ReportFailureColumns";
import {
  tblFailureReportAttachment,
  tblFailureReports,
  TypeTblFailureReports,
} from "@/core/api/generated/api";

const getRowId = (row: TypeTblFailureReports) => row.failureReportId;

export default function PageReportFailure() {
  const [label, setLabel] = useState<string | null>(null);

  const [openForm, setOpenForm] = useState(false);
  const [openFilter, setOpenFilter] = useState(true);

  const [mode, setMode] = useState<"create" | "update">("create");

  const [selectedRowId, setSelectedRowId] = useState<number | null>(null);

  const [filter, setFilter] = useState<FailureReportFilter | null>(null);

  const getAll = useCallback(
    () =>
      tblFailureReports.getAll({
        filter: filter ?? undefined,
        include: {
          tblComponentUnit: true,
          tblDiscipline: true,
          tblFailureSeverityLevel: true,
          tblFailureStatus: true,
          tblFailureGroupFollow: true,
          tblUsersTblFailureReportsReportedUserIdTotblUsers: true,
          tblUsersTblFailureReportsApprovedUserIdTotblUsers: true,
          tblUsersTblFailureReportsClosedUserIdTotblUsers: true,
        },
      }),
    [filter],
  );

  const { rows, loading, handleRefresh, handleDelete } = useDataGrid(
    getAll,
    tblFailureReports.deleteById,
    "failureReportId",
    !openFilter,
  );

  // === Handlers ===
  const handleCreate = useCallback(() => {
    setSelectedRowId(null);
    setMode("create");
    openUpsertDialog();
  }, []);

  const handleEdit = useCallback((rowId: number) => {
    setSelectedRowId(rowId);
    setMode("update");
    openUpsertDialog();
  }, []);

  const openUpsertDialog = useCallback(() => {
    setOpenForm(true);
  }, []);

  const closeUpsertDialog = useCallback(() => {
    setOpenForm(false);
  }, []);

  const handleRowClick = useCallback(
    ({ row }: { row: TypeTblFailureReports }) => {
      setLabel(row.title);
      setSelectedRowId(row.failureReportId);
    },
    [],
  );

  const openDialogFilter = useCallback(() => {
    setOpenFilter(true);
  }, []);

  const closeDialogFilter = useCallback(() => {
    setOpenFilter(false);
  }, []);

  const onFilterSubmit = (filter: FailureReportFilter | null) => {
    setFilter(filter);
    closeDialogFilter();
  };

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
          onRefreshClick={handleRefresh}
          onAddClick={handleCreate}
          onEditClick={handleEdit}
          onDoubleClick={handleEdit}
          onDeleteClick={handleDelete}
          getRowId={getRowId}
          onRowClick={handleRowClick}
          toolbarChildren={
            <FailureReportActions
              onFilter={openDialogFilter}
              onPrint={() => {}}
            />
          }
        />
        <AttachmentMap
          label={label || "Failure Attachments"}
          mapService={tblFailureReportAttachment}
          filterId={selectedRowId}
          filterKey="failureReportId"
          relName="tblFailureReports"
          tableId="failureReportAttachmentId"
        />
      </Splitter>

      <FailureReportUpsert
        open={openForm}
        mode={mode}
        recordId={selectedRowId}
        onClose={closeUpsertDialog}
        onSuccess={handleRefresh}
      />

      <FailureReportFilterDialog
        open={openFilter}
        onClose={closeDialogFilter}
        onSubmit={onFilterSubmit}
      />
    </>
  );
}
