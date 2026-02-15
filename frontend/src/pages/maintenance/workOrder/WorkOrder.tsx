import ConfirmDialog from "@/shared/components/ConfirmDialog";
import WorkOrderPrintDialog from "./WorkOrderDialogPrint";
import WorkOrderPendingDialog from "./WorkOrderDialogPending";
import WorkOrderActions from "./WorkOrderActions";
import Splitter from "@/shared/components/Splitter/Splitter";
import CustomizedDataGrid from "@/shared/components/dataGrid/DataGrid";
import TabsComponent from "./WorkOrderTabs";
import WorkOrderDialogReschedule from "./WorkOrderDialogReschedule";
import ReportWorkDialog from "../reportWork/ReportWorkDialog";
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

const getRowId = (row: TypeTblWorkOrder) => row.workOrderId;

export default function WorkOrderPage() {
  const user = useAtomValue(atomUser);
  const userId = user?.userId as number;

  // Dialog States
  const [dialogIssue, setDialogIssue] = useState(false);
  const [dialogFilter, setDialogFilter] = useState(true);
  const [dialogComplete, setDialogComplete] = useState(false);
  const [dialogPending, setDialogPending] = useState(false);
  const [dialogPostponed, setDialogPostponed] = useState(false);
  const [dialogCancel, setDialogCancel] = useState(false);
  const [dialogRequest, setDialogRequest] = useState(false);
  const [dialogReschedule, setDialogReschedule] = useState(false);
  const [dialogPrint, setDialogPrint] = useState(false);

  const [filter, setFilter] = useState<WorkOrderFilter | null>(null);

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

  // Dialog Handlers
  const openDialogIssue = useCallback(() => setDialogIssue(true), []);
  const closeDialogIssue = useCallback(() => setDialogIssue(false), []);

  const openDialogPrint = useCallback(() => setDialogPrint(true), []);
  const closeDialogPrint = useCallback(() => setDialogPrint(false), []);

  const openDialogFilter = useCallback(() => setDialogFilter(true), []);
  const closeDialogFilter = useCallback(() => setDialogFilter(false), []);

  const openDialogComplete = useCallback(() => setDialogComplete(true), []);
  const closeDialogComplete = useCallback(() => setDialogComplete(false), []);

  const openDialogPending = useCallback(() => setDialogPending(true), []);
  const closeDialogPending = useCallback(() => setDialogPending(false), []);

  const openDialogPostponed = useCallback(() => setDialogPostponed(true), []);
  const closeDialogPostponed = useCallback(() => setDialogPostponed(false), []);

  const openDialogCancel = useCallback(() => setDialogCancel(true), []);
  const closeDialogCancel = useCallback(() => setDialogCancel(false), []);

  const openDialogRequest = useCallback(() => setDialogRequest(true), []);
  const closeDialogRequest = useCallback(() => setDialogRequest(false), []);

  const openDialogReschedule = useCallback(() => setDialogReschedule(true), []);
  const closeDialogReschedule = useCallback(
    () => setDialogReschedule(false),
    [],
  );

  // Action Handlers
  const onFilterClick = useCallback(
    () => openDialogFilter(),
    [openDialogFilter],
  );
  const onIssueClick = useCallback(() => openDialogIssue(), [openDialogIssue]);
  const onCompleteClick = useCallback(
    () => openDialogComplete(),
    [openDialogComplete],
  );
  const onPendingClick = useCallback(
    () => openDialogPending(),
    [openDialogPending],
  );
  const onPostponedClick = useCallback(
    () => openDialogPostponed(),
    [openDialogPostponed],
  );
  const onCancelClick = useCallback(
    () => openDialogCancel(),
    [openDialogCancel],
  );
  const onRequestClick = useCallback(
    () => openDialogRequest(),
    [openDialogRequest],
  );
  const onRescheduleClick = useCallback(
    () => openDialogReschedule(),
    [openDialogReschedule],
  );
  const onPrintClick = useCallback(() => openDialogPrint(), [openDialogPrint]);

  const handleRowSelectionChange = useCallback(
    (model: GridRowSelectionModel) => {
      setRowSelectionModel(model);
    },
    [],
  );

  // Submit Handlers
  const handleSubmitFilter = (filter: WorkOrderFilter | null) => {
    setFilter(filter);
    closeDialogFilter();
  };

  const handleConfirmCancel = async () => {
    try {
      const updates = selectedWorkOrders.map((wo) =>
        tblWorkOrder.update(wo.workOrderId, {
          tblWorkOrder: {
            connect: {
              workOrderId: 7,
            },
          }, // Cancel
          completed: new Date().toString(),
        }),
      );

      const results = await Promise.all(updates);

      // Optimistic update for all canceled work orders
      results.forEach((record) => {
        successCancel(record);
      });

      closeDialogCancel();
    } catch (error) {
      console.error("Error canceling work orders:", error);
      // Handle error (show toast notification, etc.)
    }
  };

  const handleConfirmPostponed = async () => {
    try {
      const updates = selectedWorkOrders.map((wo) =>
        tblWorkOrder.update(wo.workOrderId, {
          tblWorkOrderStatus: {
            connect: {
              workOrderStatusId: 8,
            },
          },
        }),
      );

      const results = await Promise.all(updates);

      // Optimistic update for all postponed work orders
      results.forEach((record) => {
        successPostponed(record);
      });

      closeDialogPostponed();
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

      closeDialogIssue();
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

      closeDialogRequest();
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

      closeDialogReschedule();
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
      completed: record.completed,
    });
  };

  const successPostponed = (record: TypeTblWorkOrder) => {
    optimisticUpdate(record.workOrderId, {
      tblWorkOrderStatus: record.tblWorkOrderStatus,
      workOrderStatusId: 8,
    });
  };

  const successComplete = (record: TypeTblWorkOrder) => {
    closeDialogComplete();
    optimisticUpdate(record.workOrderId, {
      tblWorkOrderStatus: record.tblWorkOrderStatus,
      workOrderStatusId: 5,
      completed: record.completed,
    });
  };
  return (
    <>
      <Splitter horizontal initialPrimarySize="65%">
        <CustomizedDataGrid
          disableRowNumber
          disableEdit
          disableDelete
          checkboxSelection
          showToolbar
          label="WorkOrders"
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
              onFilter={onFilterClick}
              onIssue={onIssueClick}
              onComplete={onCompleteClick}
              onPending={onPendingClick}
              onPostponed={onPostponedClick}
              onCancel={onCancelClick}
              onRequest={onRequestClick}
              onReschedule={onRescheduleClick}
              onPrint={onPrintClick}
            />
          }
        />

        <TabsComponent workOrder={selectedWorkOrders[0]} />
      </Splitter>

      {/* Filter Dialog */}
      <WorkOrderFilterDialog
        open={dialogFilter}
        onClose={closeDialogFilter}
        onSubmit={handleSubmitFilter}
      />

      {/* Print Dialog */}
      <WorkOrderPrintDialog
        title="Print WorkOrder"
        workOrders={selectedWorkOrders}
        open={dialogPrint}
        onClose={closeDialogPrint}
        readOnly={true}
      />

      {/* Issue Dialog */}
      <WorkOrderPrintDialog
        title="Issue WorkOrder(s)"
        workOrders={selectedWorkOrders}
        open={dialogIssue}
        onClose={closeDialogIssue}
        onSubmit={handleSubmitIssue}
      />

      {/* Complete Dialog */}
      <ReportWorkDialog
        onSuccess={successComplete}
        onClose={closeDialogComplete}
        open={dialogComplete}
        workOrderId={selectedWorkOrders[0]?.workOrderId}
      />

      {/* Pending Dialog */}
      <WorkOrderPendingDialog
        onSuccess={successPending}
        open={dialogPending}
        onClose={closeDialogPending}
        workOrder={selectedWorkOrders[0] ?? null}
      />

      {/* Postponed Dialog */}
      <ConfirmDialog
        open={dialogPostponed}
        title="Postponed Work Order(s)"
        message={`Are you sure you want to Postponed ${selectedWorkOrders.length} work order(s)?`}
        confirmText="Postponed"
        cancelText="Cancel"
        onConfirm={handleConfirmPostponed}
        onCancel={closeDialogPostponed}
      />

      {/* Cancel Confirm Dialog */}
      <ConfirmDialog
        open={dialogCancel}
        title="Cancel Work Orders"
        message={`Are you sure you want to cancel ${selectedWorkOrders.length} work order(s)?`}
        confirmText="Cancel WorkOrder"
        cancelText="Close"
        confirmColor="error"
        onConfirm={handleConfirmCancel}
        onCancel={closeDialogCancel}
      />

      {/* Request Dialog */}
      <ConfirmDialog
        open={dialogRequest}
        title="Request Work Orders"
        message={`Are you sure you want to request ${selectedWorkOrders.length} work order(s)?`}
        confirmText="Request"
        cancelText="Close"
        onConfirm={handleSubmitRequest}
        onCancel={closeDialogRequest}
      />

      {/* Reschedule Dialog */}
      <WorkOrderDialogReschedule
        workOrder={selectedWorkOrders[0]}
        open={dialogReschedule}
        onClose={closeDialogReschedule}
        onSuccess={successReschedule}
      />
    </>
  );
}
