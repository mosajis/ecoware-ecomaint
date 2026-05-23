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
import { RouteDetail as RouteMaintLogDetail } from "../maintLog/MaintLogRoute";
import { useCallback, useMemo, useState } from "react";
import { columns } from "./WorkOrderColumns";
import { tblWorkOrder, TypeTblWorkOrder } from "@/core/api/generated/api";
import WorkOrderFilterDialog, {
  type WorkOrderFilter,
} from "./WorkOrderDialogFilter";
import { useAtomValue } from "jotai";
import { useDataGrid } from "@/shared/hooks/useDataGrid";
import { GridRowId, GridRowSelectionModel } from "@mui/x-data-grid";
import { atomUser } from "@/pages/auth/auth.atom";
import { useDialogs } from "@/shared/hooks/useDialogs";
import { toast } from "sonner";
import { over } from "lodash-es";
import { useRouter } from "@tanstack/react-router";

const getRowId = (row: TypeTblWorkOrder) => row.workOrderId;

export type PendingRedirectType = "maintLog" | null;

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
      .filter((w) => w !== undefined);
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

  const handleRedirectConfirm = useCallback(() => {
    if (!pendingRedirect.id || !pendingRedirect.type) return;

    const routes = {
      maintLog: RouteMaintLogDetail,
    };

    const route = routes[pendingRedirect.type];

    if (route?.to) {
      openInNewTab(route, pendingRedirect.id, pendingRedirect.breadcrumb);
    }

    setPendingRedirect(DEFAULT_PENDING_REDIRECT);

    closeDialog("pendingRedirect");
  }, [pendingRedirect, closeDialog, openInNewTab]);

  // Submit Handlers
  const handleSubmitFilter = (filter: WorkOrderFilter | null) => {
    setFilter(filter);
    closeDialog("dialogFilter");
  };

  const handleConfirmCancel = async () => {
    try {
      const updates = selectedWorkOrders.map((wo) =>
        tblWorkOrder.update(
          wo.workOrderId,
          {
            tblWorkOrderStatus: {
              connect: {
                workOrderStatusId: 7,
              },
            },
          },
          {
            include: {
              tblWorkOrderStatus: true,
            },
          },
        ),
      );

      const results = await Promise.all(updates);

      // Optimistic update for all canceled work orders
      results.forEach((record) => {
        successCancel(record);
      });

      closeDialog("dialogCancel");
    } catch (error) {
      toast.error("Failed to cancel work orders");
    }
  };

  const handleConfirmPostponed = async () => {
    try {
      const updates = selectedWorkOrders.map((wo) =>
        tblWorkOrder.update(
          wo.workOrderId,
          {
            tblWorkOrderStatus: {
              connect: {
                workOrderStatusId: 8,
              },
            },
          },
          {
            include: {
              tblWorkOrderStatus: true,
            },
          },
        ),
      );

      const results = await Promise.all(updates);

      // Optimistic update for all postponed work orders
      results.forEach((record) => {
        successPostponed(record);
      });

      closeDialog("dialogPostponed");
    } catch (error) {
      console.error("Error postponing work orders:", error);
    }
  };

  const handleSubmitIssue = async () => {
    try {
      const updates = selectedWorkOrders.map((wo) =>
        tblWorkOrder.update(
          wo.workOrderId,
          {
            tblWorkOrderStatus: { connect: { workOrderStatusId: 3 } }, // Issue
            issuedDate: new Date().toString(),
            tblEmployeeTblWorkOrderIssuedByTotblEmployee: {
              connect: {
                employeeId,
              },
            },
          },
          {
            include: {
              tblWorkOrderStatus: true,
            },
          },
        ),
      );

      const results = await Promise.all(updates);

      // Optimistic update for all issued work orders
      results.forEach((record) => {
        successIssue(record);
      });

      // setRowSelectionModel({ type: "include", ids: new Set<GridRowId>() });

      closeDialog("dialogIssue");
    } catch (error) {
      console.error("Error issuing work orders:", error);
    }
  };

  const handleSubmitRequest = async () => {
    try {
      const updates = selectedWorkOrders.map((wo) =>
        tblWorkOrder.update(wo.workOrderId, {
          tblWorkOrderStatus: {
            connect: {
              workOrderStatusId: 1,
            },
          },
          created: new Date().toString(),
        }),
      );

      const results = await Promise.all(updates);

      // Optimistic update for all requested work orders
      results.forEach((record) => {
        successRequest(record);
      });

      closeDialog("dialogRequest");
    } catch (error) {
      console.error("Error requesting work orders:", error);
    }
  };

  const handleSubmitReschedule = async (data: {
    dueDate: Date;
    window?: number;
  }) => {
    try {
      const updates = selectedWorkOrders.map((wo) =>
        tblWorkOrder.update(wo.workOrderId, {
          dueDate: data.dueDate.toString(),
          window: data.window,
        }),
      );

      const results = await Promise.all(updates);

      // Optimistic update for all rescheduled work orders
      results.forEach((record) => {
        successReschedule(record);
      });

      closeDialog("dialogReschedule");
    } catch (error) {
      console.error("Error rescheduling work orders:", error);
    }
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

  const successRequest = (record: TypeTblWorkOrder) => {
    optimisticUpdate(record.workOrderId, {
      tblWorkOrderStatus: record.tblWorkOrderStatus,
      created: record.created,
    });
  };

  const successReschedule = (record: TypeTblWorkOrder) => {
    optimisticUpdate(record.workOrderId, {
      tblWorkOrderStatus: record.tblWorkOrderStatus,
      dueDate: record.dueDate,
      window: record.window,
    });
  };

  const successIssue = (record: TypeTblWorkOrder) => {
    optimisticUpdate(record.workOrderId, {
      tblWorkOrderStatus: record.tblWorkOrderStatus,
      issuedDate: record.issuedDate,
    });
  };

  const successCancel = (record: TypeTblWorkOrder) => {
    optimisticUpdate(record.workOrderId, {
      tblWorkOrderStatus: record.tblWorkOrderStatus,
    });
  };

  const successPostponed = (record: TypeTblWorkOrder) => {
    optimisticUpdate(record.workOrderId, {
      tblWorkOrderStatus: record.tblWorkOrderStatus,
    });
  };

  const successComplete = (record: TypeTblWorkOrder) => {
    optimisticUpdate(record.workOrderId, {
      tblWorkOrderStatus: {
        name: "Complete",
      },
      completed: record.completed,
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
              onRequest={() => openDialog("dialogRequest")}
              onReschedule={() => openDialog("dialogReschedule")}
              onPrint={() => openDialog("dialogPrint")}
            />
          }
        />

        <TabsComponent workOrder={selectedRow} />
      </Splitter>

      {/* Filter Dialog */}
      <WorkOrderFilterDialog
        open={dialogs.dialogFilter}
        onClose={() => closeDialog("dialogFilter")}
        onSubmit={handleSubmitFilter}
      />

      {/* Print Dialog */}
      <WorkOrderPrintDialog
        title="Print WorkOrder"
        workOrders={selectedWorkOrders}
        open={dialogs.dialogPrint}
        onClose={() => closeDialog("dialogPrint")}
        hideFooter={true}
      />

      {/* Issue Dialog */}
      <WorkOrderPrintDialog
        hideFooter={false}
        title="Issue WorkOrder(s)"
        workOrders={selectedWorkOrders}
        open={dialogs.dialogIssue}
        onClose={() => closeDialog("dialogIssue")}
        onSubmit={handleSubmitIssue}
      />

      {/* Complete Dialog */}
      <MaintLogUpsert
        title="Complete WorkOrder"
        mode="create"
        onSuccess={successComplete}
        open={dialogs.dialogComplete}
        onClose={() => closeDialog("dialogComplete")}
        workOrderId={selectedWorkOrders[0]?.workOrderId}
      />

      {/* Pending Dialog */}
      <WorkOrderPendingDialog
        onSuccess={successPending}
        open={dialogs.dialogPending}
        onClose={() => closeDialog("dialogPending")}
        workOrder={selectedWorkOrders[0] ?? null}
      />

      {/* Postponed Dialog */}
      <ConfirmDialog
        open={dialogs.dialogPostponed}
        title="Postponed Work Order(s)"
        message={`Are you sure you want to Postponed ${selectedWorkOrders.length} work order(s)?`}
        confirmText="Postponed"
        cancelText="Cancel"
        onConfirm={handleConfirmPostponed}
        onCancel={() => closeDialog("dialogPostponed")}
      />

      {/* Cancel Confirm Dialog */}
      <ConfirmDialog
        open={dialogs.dialogCancel}
        title="Cancel Work Orders"
        message={`Are you sure you want to cancel ${selectedWorkOrders.length} work order(s)?`}
        confirmText="Cancel WorkOrder"
        cancelText="Close"
        confirmColor="error"
        onConfirm={handleConfirmCancel}
        onCancel={() => closeDialog("dialogCancel")}
      />

      {/* Request Dialog */}
      <ConfirmDialog
        open={dialogs.dialogRequest}
        title="Request Work Orders"
        message={`Are you sure you want to request ${selectedWorkOrders.length} work order(s)?`}
        confirmText="Request"
        cancelText="Close"
        onConfirm={handleSubmitRequest}
        onCancel={() => closeDialog("dialogRequest")}
      />

      {/* Reschedule Dialog */}
      {dialogs.dialogReschedule && (
        <WorkOrderDialogReschedule
          workOrder={selectedWorkOrders[0]}
          open={dialogs.dialogReschedule}
          onClose={() => closeDialog("dialogReschedule")}
          onSuccess={successReschedule}
        />
      )}

      <WorkOrderDetailDialog
        open={dialogs.workOrderDetail}
        onClose={() => closeDialog("workOrderDetail")}
        workOrderId={selectedRowId}
      />

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
