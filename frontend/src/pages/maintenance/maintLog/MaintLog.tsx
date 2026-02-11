import CustomizedDataGrid from "@/shared/components/dataGrid/DataGrid";
import TabsComponent from "./MaintLogTabs";
import Splitter from "@/shared/components/Splitter/Splitter";
import ReportWorkDialog from "../reportWork/ReportWorkDialog";
import MaintLogFollowDialog from "./maintLogDialogFollow";
import MaintLogActions from "./maintLogActions";
import { useDataGrid } from "@/shared/hooks/useDataGrid";
import { useCallback, useState } from "react";
import { columns } from "./MaintLogColumns";
import {
  tblMaintLog,
  TypeTblFollowStatus,
  TypeTblMaintLog,
} from "@/core/api/generated/api";
import MaintLogFilterDialog, {
  type MaintLogFilter,
} from "./maintLogDialogFilter";

const getRowId = (row: TypeTblMaintLog) => row.maintLogId;

export default function PageMaintLog() {
  const [dialogReportWork, setDialogReportWork] = useState(false);
  const [dialogFilter, setDialogFilter] = useState(true);
  const [dialogFollow, setDialogFollow] = useState(false);

  const [selectedRow, setSelectedRow] = useState<TypeTblMaintLog | null>(null);
  const [mode, setMode] = useState<"create" | "update">("create");

  const [filter, setFilter] = useState<MaintLogFilter | null>(null);

  const handleEdit = (rowId: Number) => {
    setMode("update");
    // setSelectedRow(row);
    handleReportWorkOpen();
  };

  const handleRowClick = (params: any) => {
    setSelectedRow(params.row);
  };

  const handleAddClick = () => {
    setMode("create");
    handleReportWorkOpen();
  };

  const getAll = useCallback(() => {
    return tblMaintLog.getAll({
      filter: filter ?? undefined,
      include: {
        tblComponentUnit: {
          include: {
            tblCompStatus: true,
          },
        },
        tblWorkOrder: true,
        tblMaintClass: true,
        tblJobDescription: true,
      },
    });
  }, [filter]);

  const { rows, loading, handleRefresh, optimisticUpdate } = useDataGrid(
    getAll,
    tblMaintLog.deleteById,
    "maintLogId",
  );

  // Submit Handlers
  const handleFollowOpen = useCallback(() => {
    setDialogFollow(true);
  }, []);

  const handleFollowClose = useCallback(() => {
    setDialogFollow(false);
  }, []);

  const handleSubmitFilter = (filter: MaintLogFilter | null) => {
    setFilter(filter);
    handleFilterClose();
  };

  const handleReportWorkClose = useCallback(() => {
    setDialogReportWork(false);
  }, []);

  const handleReportWorkOpen = useCallback(() => {
    setDialogReportWork(true);
  }, []);

  const handleFilterClose = useCallback(() => {
    setDialogFilter(false);
  }, []);

  const handleFilterOpen = useCallback(() => {
    setDialogFilter(true);
  }, []);

  const handleFollowSuccess = useCallback(
    (selectedFollowStatus: TypeTblFollowStatus) => {
      if (!selectedRow?.maintLogId) return;

      // Optimistic update
      optimisticUpdate(selectedRow.maintLogId, {
        followStatusId: selectedFollowStatus.followStatusId,
        // If you have the relation loaded in your getAll include:
        tblFollowStatus: selectedFollowStatus,
      });

      // Optional: background refresh after a short delay
      setTimeout(() => {
        handleRefresh();
      }, 1800);

      // Optional: toast.success("Follow-up recorded");
    },
    [selectedRow?.maintLogId, optimisticUpdate, handleRefresh],
  );
  return (
    <>
      <Splitter horizontal>
        <CustomizedDataGrid
          showToolbar
          label={"Maintenance Log"}
          rows={rows}
          columns={columns}
          loading={loading}
          onEditClick={handleEdit}
          onAddClick={handleAddClick}
          onRowClick={handleRowClick}
          onRefreshClick={handleRefresh}
          getRowId={getRowId}
          toolbarChildren={
            <MaintLogActions
              onFilter={handleFilterOpen}
              onFollow={handleFollowOpen}
            />
          }
        />
        <TabsComponent selectedMaintLog={selectedRow} />
      </Splitter>
      <ReportWorkDialog
        open={dialogReportWork}
        onClose={handleReportWorkClose}
        maintLogId={mode === "update" ? selectedRow?.maintLogId : undefined}
      />

      <MaintLogFilterDialog
        open={dialogFilter}
        onClose={handleFilterClose}
        onSubmit={handleSubmitFilter}
      />

      <MaintLogFollowDialog
        open={dialogFollow}
        maintLogId={selectedRow?.maintLogId!}
        onClose={handleFollowClose}
        onSuccess={handleFollowSuccess}
      />
    </>
  );
}
