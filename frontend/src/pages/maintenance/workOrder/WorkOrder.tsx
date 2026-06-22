import MaintLogUpsert from "../maintLog/MaintLogUpsert";
import ConfirmDialog from "@/shared/components/ConfirmDialog";
import WorkOrderPrintDialog from "./WorkOrderDialogPrint";
import WorkOrderPendingDialog from "./WorkOrderDialogPending";
import WorkOrderActions from "./WorkOrderActions";
import Splitter from "@/shared/components/Splitter/Splitter";
import CustomizedDataGrid from "@/shared/components/dataGrid/DataGrid";
import TabsComponent from "./WorkOrderTabs";
import WorkOrderDialogReschedule from "./WorkOrderDialogReschedule";
import WorkOrderDetailDialog from "./WorkOrderDialogDetail";
import WorkOrderFilterDialog from "./WorkOrderDialogFilter";
import WorkOrderDialogCancel from "./WorkOrderDialogCancel";
import WorkOrderDialogPostpone from "./WorkOrderDialogPostpone";
import WorkOrderDialogIssue from "./WorkOrderDialogIssue";
import { type WorkOrderFilter } from "./WorkOrderDialogFilter";
import { RouteDetail as RouteMaintLogDetail } from "../maintLog/MaintLogRoute";
import { useCallback, useMemo, useState } from "react";
import { columns, getRowId } from "./WorkOrderColumns";
import { tblWorkOrder, TypeTblWorkOrder } from "@/core/api/generated/api";
import { useAtomValue } from "jotai";
import { useDataGrid } from "@/shared/hooks/useDataGrid";
import { GridRowId, GridRowSelectionModel } from "@mui/x-data-grid";
import { atomUser } from "@/pages/auth/auth.atom";
import { useDialogs } from "@/shared/hooks/useDialogs";
import { useRouter } from "@tanstack/react-router";
import { DynamicResponse } from "@/core/api/dynamicTypes";

type PendingRedirectType = "maintLog" | null;

type PendingRedirect = {
  type: PendingRedirectType;
  id: number | null;
  breadcrumb: string | null;
};

const DEFAULT_PENDING_REDIRECT: PendingRedirect = {
  type: null,
  id: null,
  breadcrumb: null,
};

export default function WorkOrderPage() {
  const user = useAtomValue(atomUser);
  const employeeId = user?.tblEmployee?.employeeId as number;

  const router = useRouter();

  const { dialogs, openDialog, closeDialog } = useDialogs({
    workOrderDetail: false,
    dialogIssue: false,
    dialogFilter: true,
    dialogComplete: false,
    dialogPending: false,
    dialogPostponed: false,
    dialogCancel: false,
    dialogRequest: false,
    dialogReschedule: false,
    dialogPrint: false,

    pendingRedirect: false,
  });

  const [filter, setFilter] = useState<WorkOrderFilter | null>(null);

  const [selectedRow, setSelectedRow] = useState<TypeTblWorkOrder | null>(null);

  const [selectedRowId, setSelectedRowId] = useState<null | number>(null);
  const [rowSelectionModel, setRowSelectionModel] =
    useState<GridRowSelectionModel>({
      type: "include",
      ids: new Set<GridRowId>(),
    });

  const getAll = useCallback(
    () =>
      tblWorkOrder.getAll({
        filter: filter ?? undefined,
      }),
    [filter],
  );

  const { rows, loading, handleRefresh, optimisticUpdate } =
    useDataGrid<TypeTblWorkOrder>(
      getAll as any,
      tblWorkOrder.deleteById,
      "workOrderId",
      filter !== null,
    );

  const selectedWorkOrders = useMemo<TypeTblWorkOrder[]>(() => {
    if (rowSelectionModel.type === "include") {
      return rows.filter((r) => rowSelectionModel.ids.has(r.workOrderId));
    } else {
      return rows.filter((r) => !rowSelectionModel.ids.has(r.workOrderId));
    }
  }, [rowSelectionModel, rows]);

  const selectedStatuses = useMemo(() => {
    return selectedWorkOrders
      .map((w) => w.tblWorkOrderStatus?.name)
      .filter((w) => w !== undefined)
      .filter((w) => w !== null);
  }, [selectedWorkOrders]);

  const handleRowSelectionChange = useCallback(
    (model: GridRowSelectionModel) => {
      setRowSelectionModel(model);
    },
    [],
  );

  const [pendingRedirect, setPendingRedirect] = useState<PendingRedirect>(
    DEFAULT_PENDING_REDIRECT,
  );

  const openInNewTab = useCallback(
    (
      route: { to: string },
      id: number,
      breadcrumb?: string | null,
      extraSearch?: Record<string, any>,
    ) => {
      const href = router.buildLocation({
        to: route.to,
        params: { id },
        search: {
          breadcrumb: breadcrumb ?? "",
          ...extraSearch,
        },
      }).href;

      window.open(href, "_blank");
    },
    [router],
  );

  const handleRedirectConfirm = useCallback(() => {
    if (!pendingRedirect.id || !pendingRedirect.type) return;

    const routes = {
      maintLog: RouteMaintLogDetail,
    };

    const route = routes[pendingRedirect.type];

    if (route?.to) {
      openInNewTab(route, pendingRedirect.id, pendingRedirect.breadcrumb, {
        tab: "Resource Used",
      });
    }

    setPendingRedirect(DEFAULT_PENDING_REDIRECT);

    closeDialog("pendingRedirect");
  }, [pendingRedirect, closeDialog, openInNewTab]);

  // Submit Handlers
  const handleSubmitFilter = (filter: WorkOrderFilter | null) => {
    setFilter(filter);
    closeDialog("dialogFilter");
  };

  // Success Handlers (Optimistic Updates)
  const successPending = (record: TypeTblWorkOrder) => {
    optimisticUpdate(record.workOrderId, {
      tblPendingType: record.tblPendingType,
      pendingdate: record.pendingdate ?? undefined,
      tblWorkOrderStatus: record.tblWorkOrderStatus,
      userComment: record.userComment,
    });
  };

  const successReschedule = (record: TypeTblWorkOrder) => {
    optimisticUpdate(record.workOrderId, {
      tblWorkOrderStatus: record.tblWorkOrderStatus,
      dueDate: record.dueDate,
      window: record.window,
    });
  };

  const successIssue = useCallback(
    (workOrders: TypeTblWorkOrder[]) => {
      workOrders.forEach((wo) => {
        optimisticUpdate(wo.workOrderId, {
          tblWorkOrderStatus: wo.tblWorkOrderStatus,
          issuedDate: wo.issuedDate,
        });
      });
    },
    [optimisticUpdate],
  );

  const successCancel = useCallback(
    (workOrders: TypeTblWorkOrder[]) => {
      workOrders.forEach((wo) => {
        optimisticUpdate(wo.workOrderId, {
          tblWorkOrderStatus: wo.tblWorkOrderStatus,
        });
      });
    },
    [optimisticUpdate],
  );

  const successPostponed = useCallback(
    (workOrders: TypeTblWorkOrder[]) => {
      workOrders.forEach((wo) => {
        optimisticUpdate(wo.workOrderId, {
          tblWorkOrderStatus: wo.tblWorkOrderStatus,
        });
      });
    },
    [optimisticUpdate],
  );

  const successComplete = (record: DynamicResponse<"postTblMaintLog">) => {
    optimisticUpdate(record.workOrderId, {
      tblWorkOrderStatus: {
        name: "Complete",
      },
      // CHECK -------------
      completed: record.dateDone,
    });

    closeDialog("dialogComplete");
    if (record?.maintLogId) {
      setPendingRedirect({
        type: "maintLog",
        id: record.maintLogId,
        breadcrumb: selectedWorkOrders[0]?.tblComponentUnit?.compNo || "",
      });

      openDialog("pendingRedirect");
    }
  };

  const handleClick = ({ row }: any) => {
    setSelectedRow(row);
  };

  const handleDoubleClick = (rowId: number) => {
    openDialog("workOrderDetail");
    setSelectedRowId(rowId);
  };
  const handleRedirectCancel = useCallback(() => {
    setPendingRedirect(DEFAULT_PENDING_REDIRECT);

    closeDialog("pendingRedirect");
  }, [closeDialog]);
  return (
    <>
      <Splitter horizontal initialPrimarySize="65%">
        <CustomizedDataGrid
          disableRowNumber
          disableEdit
          disableDelete
          checkboxSelection
          disableRowSelectionOnClick
          onRowClick={handleClick}
          onDoubleClick={handleDoubleClick}
          showToolbar
          label="WorkOrders"
          elementId={1340}
          rows={rows}
          columns={columns}
          loading={loading}
          getRowId={getRowId}
          rowSelectionModel={rowSelectionModel}
          onRowSelectionModelChange={handleRowSelectionChange}
          onRefreshClick={handleRefresh}
          toolbarChildren={
            <WorkOrderActions
              selectedStatuses={selectedStatuses}
              onFilter={() => openDialog("dialogFilter")}
              onIssue={() => openDialog("dialogIssue")}
              onComplete={() => openDialog("dialogComplete")}
              onPending={() => openDialog("dialogPending")}
              onPostponed={() => openDialog("dialogPostponed")}
              onCancel={() => openDialog("dialogCancel")}
              onReschedule={() => openDialog("dialogReschedule")}
              onPrint={() => openDialog("dialogPrint")}
            />
          }
        />

        <TabsComponent workOrder={selectedRow as TypeTblWorkOrder} />
      </Splitter>

      {/* Filter Dialog */}
      <WorkOrderFilterDialog
        open={dialogs.dialogFilter}
        onClose={() => closeDialog("dialogFilter")}
        onSubmit={handleSubmitFilter}
      />

      {/* Print Dialog */}
      {dialogs.dialogPrint && (
        <WorkOrderPrintDialog
          title="Print WorkOrder"
          workOrders={selectedWorkOrders}
          open={dialogs.dialogPrint}
          onClose={() => closeDialog("dialogPrint")}
          hideFooter={true}
        />
      )}

      {/* Issue Dialog */}
      {dialogs.dialogIssue && (
        <WorkOrderDialogIssue
          open={dialogs.dialogIssue}
          onClose={() => closeDialog("dialogIssue")}
          workOrders={selectedWorkOrders}
          onSuccess={successIssue}
        />
      )}

      {/* Complete Dialog */}
      {dialogs.dialogComplete && (
        <MaintLogUpsert
          title="Complete WorkOrder"
          mode="create"
          onSuccess={successComplete}
          open={dialogs.dialogComplete}
          onClose={() => closeDialog("dialogComplete")}
          workOrderId={selectedWorkOrders[0]?.workOrderId}
        />
      )}

      {/* Pending Dialog */}
      {dialogs.dialogPending && (
        <WorkOrderPendingDialog
          onSuccess={successPending}
          open={dialogs.dialogPending}
          onClose={() => closeDialog("dialogPending")}
          workOrder={selectedWorkOrders[0] ?? null}
        />
      )}

      {dialogs.dialogCancel && (
        <WorkOrderDialogCancel
          open={dialogs.dialogCancel}
          onClose={() => closeDialog("dialogCancel")}
          workOrders={selectedWorkOrders}
          onSuccess={successCancel}
        />
      )}

      {dialogs.dialogPostponed && (
        <WorkOrderDialogPostpone
          open={dialogs.dialogPostponed}
          onClose={() => closeDialog("dialogPostponed")}
          workOrders={selectedWorkOrders}
          onSuccess={successPostponed}
        />
      )}

      {/* Reschedule Dialog */}
      {dialogs.dialogReschedule && (
        <WorkOrderDialogReschedule
          workOrder={selectedWorkOrders[0]}
          open={dialogs.dialogReschedule}
          onClose={() => closeDialog("dialogReschedule")}
          onSuccess={successReschedule}
        />
      )}

      {dialogs.workOrderDetail && (
        <WorkOrderDetailDialog
          open={dialogs.workOrderDetail}
          onClose={() => closeDialog("workOrderDetail")}
          workOrderId={selectedRowId}
        />
      )}

      {dialogs.pendingRedirect && (
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
      )}
    </>
  );
}
