import CustomizedDataGrid from "@/shared/components/dataGrid/DataGrid";
import TabsComponent from "./MaintLogTabs";
import Splitter from "@/shared/components/Splitter/Splitter";
import MaintLogFollowDialog from "./MaintLogDialogFollow";
import MaintLogActions from "./MaintLogActions";
import MaintLogDialogPrint from "./MaintLogDialogPrint";
import { useDataGrid } from "@/shared/hooks/useDataGrid";
import { useCallback, useMemo, useState } from "react";
import { GridRowId, GridRowSelectionModel } from "@mui/x-data-grid";
import { columns } from "./MaintLogColumns";
import {
  tblMaintLog,
  TypeTblFollowStatus,
  TypeTblMaintLog,
} from "@/core/api/generated/api";
import MaintLogFilterDialog, {
  type MaintLogFilter,
} from "./MaintLogDialogFilter";
import { useDialogs } from "@/shared/hooks/useDialogs";

const getRowId = (row: TypeTblMaintLog) => row.maintLogId;

export default function PageMaintLog() {
  const { dialogs, openDialog, closeDialog, closeAllDialogs, isAnyOpen } =
    useDialogs({
      filter: false,
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
    });
  }, [filter]);

  const { rows, loading, handleRefresh, optimisticUpdate } = useDataGrid(
    getAll,
    tblMaintLog.deleteById,
    "maintLogId",
  );

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
        // followStatusId: selectedFollowStatus.followStatusId,
        // tblFollowStatus: selectedFollowStatus,
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
          label="Maintenance Log"
          rows={rows}
          columns={columns}
          loading={loading}
          onRowClick={handleRowClick}
          onRefreshClick={handleRefresh}
          getRowId={getRowId}
          checkboxSelection
          disableRowSelectionOnClick
          rowSelectionModel={selectionModel}
          onRowSelectionModelChange={handleSelectionChange}
          toolbarChildren={
            <MaintLogActions
              onFilter={() => openDialog("filter")}
              onFollow={() => openDialog("follow")}
              onPrint={() => openDialog("print")}
              hasFilter={hasFilter}
              selectedCount={selectedRows.length}
            />
          }
        />
        <TabsComponent selectedMaintLog={selectedRow} />
      </Splitter>

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
