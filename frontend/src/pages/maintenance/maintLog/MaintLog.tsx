import CustomizedDataGrid from "@/shared/components/dataGrid/DataGrid";
import TabsComponent from "./MaintLogTabs";
import Splitter from "@/shared/components/Splitter/Splitter";
import MaintLogFollowDialog from "./MaintLogDialogFollow";
import MaintLogDialogPrint from "./MaintLogDialogPrint";
import Actions from "./MaintLogActions";
import MaintLogUpsert from "./MaintLogUpsert";
import { useDataGrid } from "@/shared/hooks/useDataGrid";
import { useCallback, useMemo, useState } from "react";
import { GridRowSelectionModel } from "@mui/x-data-grid";
import { useDialogs } from "@/shared/hooks/useDialogs";
import { columns, getRowId } from "./MaintLogColumns";
import {
  tblMaintLog,
  TypeTblFollowStatus,
  TypeTblMaintLog,
} from "@/core/api/generated/api";
import MaintLogFilterDialog, {
  type MaintLogFilter,
} from "./MaintLogDialogFilter";

export default function PageMaintLog() {
  /* ---------------- dialogs ---------------- */
  const { dialogs, openDialog, closeDialog } = useDialogs({
    filter: true,
    follow: false,
    print: false,
    detail: false,
    edit: false,
    create: false,
  });

  /* ---------------- state ---------------- */
  const [selectedRow, setSelectedRow] = useState<TypeTblMaintLog | null>(null);
  const [selectedRowId, setSelectedRowId] = useState<number | null>(null);

  const [selectionModel, setSelectionModel] = useState<GridRowSelectionModel>({
    type: "include",
    ids: new Set(),
  });

  const [filter, setFilter] = useState<MaintLogFilter | null>(null);

  const hasFilter = Array.isArray(filter?.AND) && filter.AND.length > 0;

  /* ---------------- data ---------------- */
  const getAll = useCallback(() => {
    return tblMaintLog.getAll({
      filter: filter ?? undefined,
      sort: "dateDone:desc",
    });
  }, [filter]);

  const { rows, loading, handleRefresh, optimisticUpdate, handleDelete } =
    useDataGrid(getAll, tblMaintLog.deleteById, "maintLogId", !dialogs.filter);

  /* ---------------- selection ---------------- */
  const selectedRows = useMemo<TypeTblMaintLog[]>(() => {
    const hasId = (id: number) =>
      selectionModel.ids.has(id) || selectionModel.ids.has(String(id));

    return selectionModel.type === "include"
      ? rows.filter((r) => hasId(r.maintLogId))
      : rows.filter((r) => !hasId(r.maintLogId));
  }, [selectionModel, rows]);

  /* ---------------- row events ---------------- */
  const handleRowClick = useCallback((params: any) => {
    setSelectedRow(params.row);
  }, []);

  const handleRowDoubleClick = useCallback(
    (rowId: number) => {
      setSelectedRowId(rowId);
      openDialog("detail");
    },
    [openDialog],
  );

  const handleSelectionChange = useCallback((m: GridRowSelectionModel) => {
    setSelectionModel(m);
  }, []);

  /* ---------------- filter ---------------- */
  const handleSubmitFilter = useCallback(
    (f: MaintLogFilter | null) => {
      setFilter(f);
      closeDialog("filter");
    },
    [closeDialog],
  );

  /* ---------------- follow ---------------- */
  const handleFollowSuccess = useCallback(
    (selectedFollowStatus: TypeTblFollowStatus) => {
      if (!selectedRow?.maintLogId) return;

      optimisticUpdate(selectedRow.maintLogId, {
        tblFollowStatus: {
          fsName: selectedFollowStatus.fsName,
        },
      });

      setTimeout(() => handleRefresh(), 1500);
    },
    [selectedRow?.maintLogId, optimisticUpdate, handleRefresh],
  );

  /* ---------------- render ---------------- */
  return (
    <>
      <Splitter horizontal>
        <CustomizedDataGrid
          showToolbar
          checkboxSelection
          disableRowNumber
          disableRowSelectionOnClick
          externalRowSelection
          label="Maint Log"
          elementId={1420}
          rows={rows}
          columns={columns}
          loading={loading}
          getRowId={getRowId}
          rowSelectionModel={selectionModel}
          onRowSelectionModelChange={handleSelectionChange}
          onRowClick={handleRowClick}
          onDoubleClick={handleRowDoubleClick}
          onDeleteClick={handleDelete}
          onRefreshClick={handleRefresh}
          onEditClick={() => {
            const id = selectionModel.ids.values().next().value;
            if (id) {
              setSelectedRowId(Number(id));
              openDialog("edit");
            }
          }}
          onAddClick={() => openDialog("create")}
          toolbarChildren={
            <Actions
              onFilter={() => openDialog("filter")}
              onFollow={() => openDialog("follow")}
              onPrint={() => openDialog("print")}
              hasFilter={hasFilter}
              selectedCount={selectedRows.length}
            />
          }
        />

        <TabsComponent selectedMaintLog={selectedRow} persistInUrl={true} />
      </Splitter>

      {/* -------- Edit Dialog -------- */}
      {dialogs.edit && selectedRowId && (
        <MaintLogUpsert
          mode="update"
          open={dialogs.edit}
          recordId={selectedRowId}
          title="Edit MaintLog"
          onClose={() => closeDialog("edit")}
          onSuccess={handleRefresh}
        />
      )}

      {/* -------- Detail Dialog -------- */}
      {dialogs.detail && selectedRowId && (
        <MaintLogUpsert
          mode="update"
          open={dialogs.detail}
          recordId={selectedRowId}
          title="Edit MaintLog"
          onClose={() => closeDialog("detail")}
          onSuccess={handleRefresh}
        />
      )}

      {/* -------- Create Dialog -------- */}
      {dialogs.create && (
        <MaintLogUpsert
          mode="create"
          open={dialogs.create}
          title="Create MaintLog"
          onClose={() => closeDialog("create")}
          onSuccess={handleRefresh}
        />
      )}

      {/* -------- Filter -------- */}
      <MaintLogFilterDialog
        open={dialogs.filter}
        onClose={() => closeDialog("filter")}
        onSubmit={handleSubmitFilter}
      />

      {/* -------- Follow -------- */}
      {selectedRow?.maintLogId && (
        <MaintLogFollowDialog
          open={dialogs.follow}
          onClose={() => closeDialog("follow")}
          maintLogId={selectedRow.maintLogId}
          onSuccess={handleFollowSuccess}
        />
      )}

      {/* -------- Print -------- */}
      <MaintLogDialogPrint
        open={dialogs.print}
        onClose={() => closeDialog("print")}
        rows={selectedRows}
      />
    </>
  );
}
