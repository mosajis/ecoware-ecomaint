import CustomizedDataGrid from "@/shared/components/dataGrid/DataGrid";
import TabsComponent from "./MaintLogTabs";
import Splitter from "@/shared/components/Splitter/Splitter";
import MaintLogFollowDialog from "./MaintLogDialogFollow";
import MaintLogDialogPrint from "./MaintLogDialogPrint";
import Actions from "./MaintLogActions";
import MaintLogUpsert from "./MaintLogUpsert";
import { useUpsertDialog } from "@/shared/hooks/useUpsertDialog";
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
  const { dialogs, openDialog, closeDialog } = useDialogs({
    filter: true,
    follow: false,
    print: false,
  });

  const [selectedRow, setSelectedRow] = useState<TypeTblMaintLog | null>(null);
  const [selectionModel, setSelectionModel] = useState<GridRowSelectionModel>({
    type: "include",
    ids: new Set(),
  });
  const [filter, setFilter] = useState<MaintLogFilter | null>(null);

  const hasFilter = Array.isArray(filter?.AND) && filter.AND.length > 0;

  const getAll = useCallback(() => {
    return tblMaintLog.getAll({
      filter: filter ?? undefined,
      sort: "dateDone:desc",
    });
  }, [filter]);

  const { rows, loading, handleRefresh, optimisticUpdate, handleDelete } =
    useDataGrid(getAll, tblMaintLog.deleteById, "maintLogId", !dialogs.filter);

  const { openCreate, openEdit, openView, dialogProps } = useUpsertDialog({
    onSuccess: handleRefresh,
  });

  const selectedRows = useMemo<TypeTblMaintLog[]>(() => {
    const hasId = (id: number) =>
      selectionModel.ids.has(id) || selectionModel.ids.has(String(id));

    if (selectionModel.type === "include") {
      return rows.filter((r) => hasId(r.maintLogId));
    } else {
      return rows.filter((r) => !hasId(r.maintLogId));
    }
  }, [selectionModel, rows]);

  // Row
  const handleRowClick = useCallback((params: any) => {
    setSelectedRow(params.row);
  }, []);

  const handleSelectionChange = useCallback((m: GridRowSelectionModel) => {
    setSelectionModel(m as GridRowSelectionModel);
  }, []);

  // Filter
  const handleSubmitFilter = useCallback(
    (f: MaintLogFilter | null) => {
      setFilter(f);
      closeDialog("filter");
    },
    [closeDialog],
  );

  // Follow
  const handleFollowSuccess = useCallback(
    (selectedFollowStatus: TypeTblFollowStatus) => {
      if (!selectedRow?.maintLogId) return;
      optimisticUpdate(selectedRow.maintLogId, {
        tblFollowStatus: {
          fsName: selectedFollowStatus.fsName,
        },
      });
      setTimeout(() => handleRefresh(), 1800);
    },
    [selectedRow?.maintLogId, optimisticUpdate, handleRefresh],
  );

  return (
    <>
      <Splitter horizontal>
        <CustomizedDataGrid
          showToolbar
          checkboxSelection
          disableRowNumber
          disableRowSelectionOnClick
          label="Maint Log"
          elementId={1420}
          externalRowSelection={true}
          rows={rows}
          columns={columns}
          loading={loading}
          onEditClick={openEdit}
          onDoubleClick={openView}
          onDeleteClick={handleDelete}
          onRowClick={handleRowClick}
          onRefreshClick={handleRefresh}
          getRowId={getRowId}
          rowSelectionModel={selectionModel}
          onRowSelectionModelChange={handleSelectionChange}
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

      {selectedRow && (
        <MaintLogUpsert
          title={selectedRow?.tblComponentUnit?.compNo || "MaintLog View"}
          {...dialogProps}
        />
      )}

      <MaintLogFilterDialog
        open={dialogs.filter}
        onClose={() => closeDialog("filter")}
        onSubmit={handleSubmitFilter}
      />

      <MaintLogFollowDialog
        open={dialogs.follow}
        onClose={() => closeDialog("follow")}
        maintLogId={selectedRow?.maintLogId! ?? null}
        onSuccess={handleFollowSuccess}
      />

      <MaintLogDialogPrint
        open={dialogs.print}
        onClose={() => closeDialog("print")}
        rows={selectedRows}
      />
    </>
  );
}
