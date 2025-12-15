import Splitter from "@/shared/components/Splitter";
import CustomizedDataGrid from "@/shared/components/dataGrid/DataGrid";
import DataGridActionBar from "@/shared/components/dataGrid/DataGridActionBar";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import RequestPageIcon from "@mui/icons-material/RequestPage";
import EventRepeatIcon from "@mui/icons-material/EventRepeat";
import ScheduleIcon from "@mui/icons-material/Schedule";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import PrintIcon from "@mui/icons-material/Print";
import Box from "@mui/material/Box";
import TabsComponent from "./WorkOrderTabs";
import ReportPrintTemplate from "./report/ReportPrintTemplate";
import { useCallback, useMemo, useRef, useState } from "react";
import { tblWorkOrder, TypeTblWorkOrder } from "@/core/api/generated/api";
import { useDataGrid } from "@/shared/hooks/useDataGrid";
import { GridColDef, GridRowId, GridRowSelectionModel } from "@mui/x-data-grid";
import { formatDateTime } from "@/core/api/helper";
import { useReactToPrint } from "react-to-print";
import { toast } from "sonner";
import { TypeTblWorkOrderWithRels } from "./workOrderTypes";
import { STATUS_TRANSITIONS, WorkOrderStatus } from "./WorkOrderStatus";
import { calculateOverdue } from "./workOrderHelper";
import WorkOrderFilterDialog, {
  type WorkOrderFilter,
} from "./WorkOrderFilterDialog";
import ReportPrintDialog from "./report/ReportPrintDialog";

export default function WorkOrderPage() {
  /* ------------------------------------------------------------------ */
  /* State */
  /* ------------------------------------------------------------------ */
  const [issueDialogOpen, setIssueDialogOpen] = useState(false);
  const [selectedRows, setSelectedRows] = useState<GridRowId[]>([]);
  const [filter, setFilter] = useState<WorkOrderFilter | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);

  /* ------------------------------------------------------------------ */
  /* Print */
  /* ------------------------------------------------------------------ */

  /* ------------------------------------------------------------------ */
  /* Data */
  /* ------------------------------------------------------------------ */

  const getAll = useCallback(
    () =>
      tblWorkOrder.getAll({
        paginate: true,
        filter: filter ?? undefined,
        include: {
          tblComponentUnit: {
            include: {
              tblCompStatus: true,
              tblLocation: true,
            },
          },
          tblCompJob: {
            include: {
              tblJobDescription: true,
              tblPeriod: true,
            },
          },
          tblPendingType: true,
          tblDiscipline: true,
          tblWorkOrderStatus: true,
        },
      }),
    [filter]
  );

  const { rows, loading, handleRefresh } =
    useDataGrid<TypeTblWorkOrderWithRels>(
      getAll,
      tblWorkOrder.deleteById,
      "workOrderId"
    );

  /* ------------------------------------------------------------------ */
  /* Derived selection - Memoized */
  /* ------------------------------------------------------------------ */

  const selectedWorkOrders = useMemo<TypeTblWorkOrderWithRels[]>(() => {
    return rows.filter((r) => selectedRows.includes(r.workOrderId));
  }, [selectedRows, rows]);

  /* ------------------------------------------------------------------ */
  /* Helpers */
  /* ------------------------------------------------------------------ */

  const ensureSelection = useCallback((): boolean => {
    if (selectedRows.length === 0) {
      toast.error("Please select at least one Work Order");
      return false;
    }
    return true;
  }, [selectedRows.length]);

  const canTransition = (
    transition: {
      allowedFrom: WorkOrderStatus[];
    },
    rows: TypeTblWorkOrderWithRels[]
  ): boolean => {
    return rows.every((row) =>
      transition.allowedFrom.includes(
        row?.tblWorkOrderStatus?.name as WorkOrderStatus
      )
    );
  };

  const updateStatus = useCallback(
    async (targetStatus: WorkOrderStatus): Promise<void> => {
      if (!ensureSelection()) return;

      const transition = STATUS_TRANSITIONS[targetStatus];

      if (!transition) {
        toast.error("This action is not supported for the selected status");
        return;
      }

      if (!canTransition(transition, selectedWorkOrders)) {
        toast.error(transition.errorMessage);
        return;
      }

      try {
        const results = await Promise.allSettled(
          selectedWorkOrders.map((row) =>
            tblWorkOrder.update(row.workOrderId, {
              tblWorkOrderStatus: {
                connect: { workOrderStatusId: transition.statusId },
              },
            })
          )
        );

        const failures = results.filter((r) => r.status === "rejected");

        if (failures.length > 0) {
          toast.error(
            `${failures.length} item(s) failed to update. Please try again.`
          );
        } else {
          toast.success("All items updated successfully");
        }

        await handleRefresh();
      } catch (error) {
        console.error("Update status error:", error);
        toast.error("An unexpected error occurred");
      }
    },
    [ensureSelection, selectedWorkOrders, handleRefresh]
  );

  const handleReschedule = useCallback((): void => {
    if (!ensureSelection()) return;
    // TODO: Implement reschedule dialog/logic
    console.warn("Reschedule not yet implemented");
    toast.info("Reschedule feature coming soon");
  }, [ensureSelection]);

  // const handlePrint = useCallback((): void => {
  //   if (!ensureSelection()) return;
  //   printFn();
  // }, [ensureSelection, printFn]);

  const handleIssueDialogClose = useCallback(() => {
    setIssueDialogOpen(false);
  }, []);

  // وقتی عملیات Issue موفقیت‌آمیز بود
  const handleIssueDialogSuccess = useCallback(() => {
    toast.success("WorkOrder issued successfully");
    setIssueDialogOpen(false);
    // می‌تونید اینجا handleRefresh یا هر آپدیت دیگری هم انجام بدید
    handleRefresh();
  }, [handleRefresh]);

  /* ------------------------------------------------------------------ */
  /* Button Click Handler */
  /* ------------------------------------------------------------------ */
  const handleOpenIssueDialog = useCallback(() => {
    if (!ensureSelection()) return;
    setIssueDialogOpen(true);
  }, [ensureSelection]);

  /* ------------------------------------------------------------------ */
  /* Columns - Memoized */
  /* ------------------------------------------------------------------ */

  const columns: GridColDef<TypeTblWorkOrderWithRels>[] = useMemo(
    () => [
      {
        field: "jobCode",
        headerName: "Job Code",
        width: 90,
        valueGetter: (_, row) =>
          row?.tblCompJob?.tblJobDescription?.jobDescCode,
      },
      {
        field: "component",
        headerName: "Component",
        flex: 2,
        valueGetter: (_, row) => row.tblComponentUnit?.compNo,
      },
      {
        field: "location",
        headerName: "Location",
        width: 100,
        valueGetter: (_, row) => row?.tblComponentUnit?.tblLocation?.name,
      },
      {
        field: "jobDescTitle",
        headerName: "Job Desc",
        flex: 2,
        valueGetter: (_, row) =>
          row?.tblCompJob?.tblJobDescription?.jobDescTitle,
      },
      {
        field: "discipline",
        headerName: "Discipline",
        width: 110,
        valueGetter: (_, row) => row?.tblDiscipline?.name,
      },
      {
        field: "status",
        headerName: "Status",
        width: 90,
        valueGetter: (_, row) => row?.tblWorkOrderStatus?.name,
      },
      {
        field: "dueDate",
        headerName: "Due Date",
        width: 130,
        valueFormatter: (value) => (value ? formatDateTime(value) : ""),
      },
      {
        field: "completed",
        headerName: "Completed Date",
        width: 130,
        valueFormatter: (value) => (value ? formatDateTime(value) : ""),
      },
      {
        field: "overDue",
        headerName: "OverDue",
        width: 80,
        valueGetter: (_, row) => calculateOverdue(row),
        renderCell: (params) => {
          if (params.value == null) return "";
          return (
            <span
              style={{
                color: params.value < 0 ? "red" : "green",
                fontWeight: 600,
              }}
            >
              {params.value}
            </span>
          );
        },
      },
      {
        field: "pendingType",
        headerName: "Pending Type",
        valueGetter: (_, row) => row?.tblPendingType?.pendTypeName,
      },
      {
        field: "priority",
        headerName: "Priority",
        width: 70,
      },
    ],
    []
  );

  /* ------------------------------------------------------------------ */
  /* Actions - Memoized */
  /* ------------------------------------------------------------------ */

  const actions = useMemo(
    () => [
      {
        label: "Filter",
        icon: <FilterAltIcon />,
        onClick: () => setFilterOpen(true),
        disabled: loading,
      },
      {
        label: "Issue",
        icon: <AssignmentTurnedInIcon />,
        onClick: handleOpenIssueDialog,
        disabled: selectedRows.length === 0,
      },
      {
        label: "Complete",
        icon: <CheckCircleIcon />,
        onClick: () => updateStatus("Complete"),
        disabled: selectedRows.length === 0,
      },
      {
        label: "Pending",
        icon: <HourglassEmptyIcon />,
        onClick: () => updateStatus("Pend"),
        disabled: selectedRows.length === 0,
      },
      {
        label: "Postponed",
        icon: <ScheduleIcon />,
        onClick: () => updateStatus("Postponed"),
        disabled: selectedRows.length === 0,
      },
      {
        label: "Request",
        icon: <RequestPageIcon />,
        onClick: () => updateStatus("Request"),
        disabled: selectedRows.length === 0,
      },
      {
        label: "Reschedule",
        icon: <EventRepeatIcon />,
        disabled: selectedRows.length === 0,
        onClick: handleReschedule,
      },
      // {
      //   label: "Print",
      //   icon: <PrintIcon />,
      //   disabled: selectedRows.length === 0,
      //   onClick: handlePrint,
      // },
    ],
    [selectedRows.length, loading, handleReschedule]
  );

  return (
    <>
      <Splitter horizontal initialPrimarySize="40%">
        <TabsComponent />

        <CustomizedDataGrid
          label="WorkOrders"
          rows={rows}
          columns={columns}
          loading={loading}
          checkboxSelection
          showToolbar
          getRowId={(row) => row.workOrderId}
          onRowSelectionModelChange={(rowSelectionModel) => {
            setSelectedRows(Array.from(rowSelectionModel.ids));
          }}
          toolbarChildren={<DataGridActionBar actions={actions} />}
        />
      </Splitter>

      <ReportPrintDialog
        workOrders={selectedWorkOrders}
        open={issueDialogOpen}
        onClose={handleIssueDialogClose}
        title="Issue WorkOrder"
        onSubmit={() => alert("asd")}
      />
      <WorkOrderFilterDialog
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        onApplyFilter={(prismaFilter) => {
          setFilter(prismaFilter);
          setFilterOpen(false);
        }}
      />
    </>
  );
}
