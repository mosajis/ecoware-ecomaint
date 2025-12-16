import ReportPrintDialog from "./WorkOrderDialogReport";
import WorkOrderActionBar from "./WorkOrderActions";
import Splitter from "@/shared/components/Splitter";
import CustomizedDataGrid from "@/shared/components/dataGrid/DataGrid";
import TabsComponent from "./WorkOrderTabs";
import StatusChip from "./customCell/Status";
import OverdueText from "./customCell/OverDue";
import { useCallback, useMemo, useState } from "react";
import { tblWorkOrder } from "@/core/api/generated/api";
import { useDataGrid } from "@/shared/hooks/useDataGrid";
import { GridColDef, GridRowId, GridRowSelectionModel } from "@mui/x-data-grid";
import { calculateOverdue, formatDateTime } from "@/core/api/helper";
import { TypeTblWorkOrderWithRels } from "./workOrderTypes";
import WorkOrderFilterDialog, {
  type WorkOrderFilter,
} from "./WorkOrderDialogFilter";

export default function WorkOrderPage() {
  const [issueDialogOpen, setIssueDialogOpen] = useState(false);
  const [selectedRows, setSelectedRows] = useState<GridRowId[]>([]);
  const [filter, setFilter] = useState<WorkOrderFilter | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);

  const getAll = useCallback(
    () =>
      tblWorkOrder.getAll({
        paginate: false,
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

  const selectedWorkOrders = useMemo<TypeTblWorkOrderWithRels[]>(() => {
    return rows.filter((r) => selectedRows.includes(r.workOrderId));
  }, [selectedRows, rows]);

  const selectedStatuses = selectedWorkOrders
    .map((w) => w.tblWorkOrderStatus?.name)
    .filter((w) => w !== undefined);

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
        renderCell: (params) => <StatusChip status={params.value} />,
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
        renderCell: (params) => <OverdueText value={params.value} />,
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

  const handleFilter = useCallback((): void => {
    setFilterOpen(true);
  }, []);

  const handleIssue = useCallback((): void => {
    setIssueDialogOpen(true);
  }, []);

  const handleComplete = useCallback((): void => {}, []);

  const handlePending = useCallback((): void => {}, []);

  const handlePostponed = useCallback((): void => {}, []);

  const handleCancel = useCallback((): void => {}, []);

  const handleRequest = useCallback((): void => {}, []);

  const handleReschedule = useCallback((): void => {}, []);

  const handlePrint = useCallback((): void => {}, []);

  const handleDialogCloseIssue = useCallback(() => {
    setIssueDialogOpen(false);
  }, []);

  const handleRowSelectionChange = useCallback(
    (model: GridRowSelectionModel) => {
      if (model.type === "include") {
        setSelectedRows(Array.from(model.ids));
      }

      if (model.type === "exclude") {
        const allIds = rows.map((r) => r.workOrderId);
        const excluded = model.ids;
        const selected = allIds.filter((id) => !excluded.has(id));
        setSelectedRows(selected);
      }
    },
    [rows]
  );

  return (
    <>
      <Splitter horizontal initialPrimarySize="40%">
        <TabsComponent workOrder={selectedWorkOrders[0] || undefined} />

        <CustomizedDataGrid
          label="WorkOrders"
          rows={rows}
          columns={columns}
          loading={loading}
          checkboxSelection
          showToolbar
          getRowId={(row) => row.workOrderId}
          onRowSelectionModelChange={handleRowSelectionChange}
          onRefreshClick={handleRefresh}
          toolbarChildren={
            <WorkOrderActionBar
              selectedStatuses={selectedStatuses}
              onIssue={handleIssue}
              onComplete={handleComplete}
              onPending={handlePending}
              onPostponed={handlePostponed}
              onCancel={handleCancel}
              onRequest={handleRequest}
            />
          }
        />
      </Splitter>

      <ReportPrintDialog
        workOrders={selectedWorkOrders}
        open={issueDialogOpen}
        onClose={handleDialogCloseIssue}
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
