import Splitter from "@/shared/components/Splitter/Splitter";
import CustomizedDataGrid from "@/shared/components/dataGrid/DataGrid";
import ComponentUnitUpsert from "./ComponentUnitUpsert";
import ComponentUnitActions from "./ComponentUnitActions";
import WorkShopUpsert from "../workShop/WorkShopUpsert";
import FailureReportUpsert from "@/pages/report/failureReport/FailureReportUpsert";
import ConfirmDialog from "@/shared/components/ConfirmDialog";

import { useRouter } from "@tanstack/react-router";
import { useDataTree } from "@/shared/hooks/useDataTree";
import { useUpsertDialog } from "@/shared/hooks/useUpsertDialog";
import { useDialogs } from "@/shared/hooks/useDialogs";
import { mapToTree } from "@/shared/components/tree/TreeUtil";
import { GenericTree } from "@/shared/components/tree/Tree";
import { useCallback, useMemo, useState } from "react";
import { columns, getItemName, getRowId } from "./ComponentUnitColumns";
import { RouteDetail } from "./ComponentUnitRoutes";
import { RouteDetail as FailureReportRouteDetail } from "@/pages/report/failureReport/FailureReportRoutes";
import { RouteDetail as WorkShopRouteDetail } from "../workShop/WorkShopRoutes";
import { RouteDetail as MaintLogRouteDetail } from "../maintLog/MaintLogRoute";

import {
  tblComponentUnit,
  TypeTblComponentUnit,
  TypeTblMaintLog,
} from "@/core/api/generated/api";
import MaintLogUpsert from "../maintLog/MaintLogUpsert";

const PERMIT_ID = 1310;

export type PendingRedirectType =
  | "failureReport"
  | "workShop"
  | "maintLog"
  | null;

export type PendingRedirect = {
  type: PendingRedirectType;
  id: number | null;
  breadcrumb: string | null;
};

export const DEFAULT_PENDING_REDIRECT: PendingRedirect = {
  type: null,
  id: null,
  breadcrumb: null,
};

export default function PageComponentUnit() {
  const router = useRouter();

  const [selectedRowId, setSelectedRowId] = useState<number | null>(null);

  const [pendingRedirect, setPendingRedirect] = useState<PendingRedirect>(
    DEFAULT_PENDING_REDIRECT,
  );

  const { dialogs, openDialog, closeDialog } = useDialogs({
    reportWork: false,
    workShop: false,
    failureReport: false,
    dialogComplete: false,
    pendingRedirect: false,
  });

  // =======================
  // DATA
  // =======================

  const getAll = useCallback(() => {
    return tblComponentUnit.getAll({
      include: {
        tblCompType: true,
        tblCompStatus: true,
        tblLocation: true,
      },
    });
  }, []);

  const treeMapper = useCallback(
    (items: TypeTblComponentUnit[]) =>
      mapToTree(items, "compId", "parentCompId"),
    [],
  );

  const { rows, tree, loading, refetch, handleDelete } =
    useDataTree<TypeTblComponentUnit>({
      getAll,
      deleteById: tblComponentUnit.deleteById,
      getId: (item) => item.compId,
      mapper: treeMapper,
    });

  // =======================
  // UPSERT DIALOG
  // =======================

  const { openCreate, openEdit, openView, dialogProps } = useUpsertDialog({
    onSuccess: refetch,
  });

  // =======================
  // SELECTED ROW
  // =======================

  const selectedRow = useMemo(() => {
    if (!selectedRowId) return null;

    return rows.find((r) => r.compId === selectedRowId) || null;
  }, [rows, selectedRowId]);

  // =======================
  // NAVIGATION
  // =======================

  const handleOpenDetail = useCallback(
    (rowId: number) => {
      const row = rows.find((i) => i.compId === rowId);

      if (!row) return;

      const href = router.buildLocation({
        to: RouteDetail.to,
        params: { rowId },
        search: {
          breadcrumb: row.compNo ?? "",
        },
      }).href;

      window.open(href, "_blank");
    },
    [router, rows],
  );

  const openInNewTab = useCallback(
    (route: { to: string }, id: number, breadcrumb?: string | null) => {
      const href = router.buildLocation({
        to: route.to,
        params: { id },
        search: {
          breadcrumb: breadcrumb ?? "",
        },
      }).href;

      window.open(href, "_blank");
    },
    [router],
  );

  // =======================
  // GRID EVENTS
  // =======================

  const handleRowClick = useCallback(
    ({ row }: { row: TypeTblComponentUnit }) => {
      setSelectedRowId(row.compId);
    },
    [],
  );

  // =======================
  // ROUTINE ACTION
  // =======================

  const handleRoutineClick = useCallback(() => {
    //
  }, []);

  // =======================
  // REDIRECT CONFIRM
  // =======================

  const handleRedirectConfirm = useCallback(() => {
    if (!pendingRedirect.id || !pendingRedirect.type) return;

    const routes = {
      failureReport: FailureReportRouteDetail,
      workShop: WorkShopRouteDetail,
      maintLog: MaintLogRouteDetail,
    };

    const route = routes[pendingRedirect.type];

    if (route?.to) {
      openInNewTab(route, pendingRedirect.id, pendingRedirect.breadcrumb);
    }

    setPendingRedirect(DEFAULT_PENDING_REDIRECT);

    closeDialog("pendingRedirect");
  }, [pendingRedirect, closeDialog, openInNewTab]);

  const handleRedirectCancel = useCallback(() => {
    setPendingRedirect(DEFAULT_PENDING_REDIRECT);

    closeDialog("pendingRedirect");
  }, [closeDialog]);

  const successUnplanned = (record: TypeTblMaintLog) => {
    closeDialog("dialogComplete");
    if (record.maintLogId) {
      setPendingRedirect({
        type: "maintLog",
        id: record.maintLogId,
        breadcrumb: selectedRow?.compNo || String(record.maintLogId),
      });

      openDialog("pendingRedirect");
    }
  };

  return (
    <>
      <Splitter initialPrimarySize="30%">
        <GenericTree<TypeTblComponentUnit>
          label="Tree View"
          elementId={PERMIT_ID}
          loading={loading}
          data={tree}
          onDoubleClick={handleOpenDetail}
          onEdit={openEdit}
          onDelete={handleDelete}
          onAdd={openCreate}
          onRefresh={refetch}
          getItemId={getRowId}
          getItemName={getItemName}
        />

        <CustomizedDataGrid
          showToolbar
          disableRowNumber
          label="List View"
          elementId={PERMIT_ID}
          rows={rows}
          columns={columns}
          loading={loading}
          getRowId={getRowId}
          onEditClick={openEdit}
          onDeleteClick={handleDelete}
          onAddClick={openCreate}
          onDoubleClick={openView}
          onRefreshClick={refetch}
          onRowClick={handleRowClick}
          toolbarChildren={
            <ComponentUnitActions
              selectedRow={selectedRow}
              onWorkShop={() => openDialog("workShop")}
              onFailureReport={() => openDialog("failureReport")}
              onNoneRoutine={() => openDialog("dialogComplete")}
              onRoutine={handleRoutineClick}
            />
          }
        />
      </Splitter>

      {/* UPSERT */}

      <ComponentUnitUpsert entityName="Component" {...dialogProps} />

      {/* FAILURE REPORT */}
      <MaintLogUpsert
        title={`UnPlanned / ${selectedRow?.compNo}`}
        mode="create"
        compId={selectedRow?.compId}
        onSuccess={successUnplanned}
        open={dialogs.dialogComplete}
        onClose={() => closeDialog("dialogComplete")}
      />

      {selectedRowId && (
        <FailureReportUpsert
          entityName="Failure Report"
          open={dialogs.failureReport}
          mode="create"
          compId={selectedRowId}
          onClose={() => closeDialog("failureReport")}
          onSuccess={(failureReport) => {
            closeDialog("failureReport");

            setPendingRedirect({
              type: "failureReport",
              id: failureReport.failureReportId,
              breadcrumb: failureReport.title,
            });

            openDialog("pendingRedirect");
          }}
        />
      )}

      {/* WORKSHOP */}

      <WorkShopUpsert
        initialCompId={selectedRowId}
        open={dialogs.workShop}
        onClose={() => closeDialog("workShop")}
        onSuccess={(workShop) => {
          closeDialog("workShop");

          setPendingRedirect({
            type: "workShop",
            id: workShop.workShopId,
            breadcrumb: workShop.title,
          });

          openDialog("pendingRedirect");
        }}
      />

      {/* CONFIRM REDIRECT */}

      <ConfirmDialog
        open={dialogs.pendingRedirect}
        title="Success"
        message="Record created successfully. Do you want to open the details page?"
        confirmText="Yes"
        cancelText="No"
        confirmColor="primary"
        icon={null}
        onCancel={handleRedirectCancel}
        onConfirm={handleRedirectConfirm}
      />
    </>
  );
}
