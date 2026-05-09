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
import { useCallback, useMemo, useState } from "react";
import { columns } from "./WorkOrderColumns";
import { tblWorkOrder, TypeTblWorkOrder } from "@/core/api/generated/api";
import WorkOrderFilterDialog, {
  type WorkOrderFilter,
} from "./WorkOrderDialogFilter";
import { useAtomValue } from "jotai";
import { useDataGrid } from "@/shared/hooks/useDataGrid";
import { GridRowId, GridRowSelectionModel } from "@mui/x-data-grid";
import { TypeTblWorkOrderWithRels } from "./types";
import { atomUser } from "@/pages/auth/auth.atom";
import { useDialogs } from "@/shared/hooks/useDialogs";
import { toast } from "sonner";
import { over } from "lodash-es";

const getRowId = (row: TypeTblWorkOrder) => row.workOrderId;

export default function WorkOrderPage() {
  const user = useAtomValue(atomUser);
  const employeeId = user?.tblEmployee?.employeeId as number;

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
  });

  const [filter, setFilter] = useState<WorkOrderFilter | null>(null);

  const [selectedRow, setSelectedRow] =
    useState<TypeTblWorkOrderWithRels | null>(null);

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
    useDataGrid<TypeTblWorkOrderWithRels>(
      getAll as any,
      tblWorkOrder.deleteById,
      "workOrderId",
      filter !== null,
    );

  const selectedWorkOrders = useMemo<TypeTblWorkOrderWithRels[]>(() => {
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
      pendingdate: record.pendingdate,
      tblWorkOrderStatus: record.tblWorkOrderStatus,
      userComment: record.userComment,
      workOrderStatusId: record.workOrderStatusId,
    });
  };

  const successRequest = (record: TypeTblWorkOrder) => {
    optimisticUpdate(record.workOrderId, {
      tblWorkOrderStatus: record.tblWorkOrderStatus,
      workOrderStatusId: 1,
      created: record.created,
    });
  };

  const successReschedule = (record: TypeTblWorkOrder) => {
    optimisticUpdate(record.workOrderId, {
      tblWorkOrderStatus: record.tblWorkOrderStatus,
      workOrderStatusId: 2,
      dueDate: record.dueDate,
      window: record.window,
    });
  };

  const successIssue = (record: TypeTblWorkOrder) => {
    optimisticUpdate(record.workOrderId, {
      tblWorkOrderStatus: record.tblWorkOrderStatus,
      workOrderStatusId: 3,
      issuedDate: record.issuedDate,
    });
  };

  const successCancel = (record: TypeTblWorkOrder) => {
    optimisticUpdate(record.workOrderId, {
      tblWorkOrderStatus: record.tblWorkOrderStatus,
      workOrderStatusId: 7,
    });
  };

  const successPostponed = (record: TypeTblWorkOrder) => {
    optimisticUpdate(record.workOrderId, {
      tblWorkOrderStatus: record.tblWorkOrderStatus,
      workOrderStatusId: 8,
    });
  };

  const successComplete = (record: TypeTblWorkOrder) => {
    optimisticUpdate(record.workOrderId, {
      tblWorkOrderStatus: {
        name: "Complete",
        workOrderStatusId: 5,
      },
      completed: record.completed,
      overdue: record.overdue,
    });

    closeDialog("dialogComplete");
  };

  const handleClick = ({ row }: any) => {
    setSelectedRow(row);
  };

  const handleDoubleClick = (rowId: number) => {
    openDialog("workOrderDetail");
    setSelectedRowId(rowId);
  };
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
    </>
  );
}
