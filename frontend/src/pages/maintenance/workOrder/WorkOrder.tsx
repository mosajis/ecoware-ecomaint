import Splitter from "@/shared/components/Splitter";
import TabsComponent from "./WorkOrderTabs";
import CustomizedDataGrid from "@/shared/components/dataGrid/DataGrid";
import DataGridActionBar from "@/shared/components/dataGrid/DataGridActionBar";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import RequestPageIcon from "@mui/icons-material/RequestPage";
import EventRepeatIcon from "@mui/icons-material/EventRepeat";
import ScheduleIcon from "@mui/icons-material/Schedule";
import { useCallback, useState } from "react";
import { tblWorkOrder, TypeTblWorkOrder } from "@/core/api/generated/api";
import { useDataGrid } from "@/shared/hooks/useDataGrid";
import { GridColDef } from "@mui/x-data-grid";
import { dataGridActionColumn } from "@/shared/components/dataGrid/DataGridActionsColumn";
import WorkOrderFilterDialog from "./WorkORderFilterDialog";
import { formatDateTime } from "@/core/api/helper";

const calculateOverdue = (row: any) => {
  const status = row?.tblWorkOrderStatus?.name?.toLowerCase();

  // اگر وضعیت در حالت‌های نادیده‌گرفته‌شده بود → خالی
  if (!status || ["complete", "control", "cancel"].includes(status)) {
    return "";
  }

  const dueDate = row?.dueDate;
  if (!dueDate) return "";

  const due = new Date(dueDate);
  if (isNaN(due.getTime())) return ""; // اگر تاریخ معتبر نبود

  const now = new Date();
  const diffDays = Math.ceil(
    (due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  );

  return diffDays;
};

export default function WorkOrderPage() {
  const [selectedRow, setSelectedRow] = useState<TypeTblWorkOrder | null>(null);
  const [openForm, setOpenForm] = useState(false);

  const handleEdit = (row: TypeTblWorkOrder) => {
    setSelectedRow(row);
    setOpenForm(true);
  };

  const getAll = useCallback(
    () =>
      tblWorkOrder.getAll({
        paginate: true,
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
            },
          },
          tblPendingType: true,
          tblDiscipline: true,
          tblWorkOrderStatus: true,
        },
      }),
    []
  );

  const { rows, loading, handleRefresh, handleDelete } = useDataGrid(
    getAll,
    tblWorkOrder.deleteById,
    "workOrderId"
  );

  const columns: GridColDef<TypeTblWorkOrder>[] = [
    {
      field: "jobCode",
      headerName: "Job Code",
      width: 90,
      // @ts-ignore
      valueGetter: (_, row) => row?.tblCompJob?.tblJobDescription?.jobDescCode,
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
      // @ts-ignore
      valueGetter: (_, row) => row?.tblComponentUnit?.tblLocation?.name,
    },
    {
      field: "jobDescTitle",
      headerName: "JobDescTitle",
      flex: 2,
      // @ts-ignore
      valueGetter: (_, row) => row?.tblCompJob?.tblJobDescription?.jobDescTitle,
    },
    {
      field: "disipline",
      headerName: "Disipline",
      width: 100,
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
        const value = params.value;
        const color = value < 0 ? "red" : "green";
        return <span style={{ color, fontWeight: 600 }}>{value}</span>;
      },
    },

    {
      field: "pendingType",
      headerName: "Pending Type",
      valueGetter: (_, row) => row?.tblPendingType?.pendTypeName,
    },
    { field: "pendingdate", headerName: "Pending Date" },
    {
      field: "triggeredBy",
      headerName: "Triggered By (W-Rel)",
    },
    {
      field: "componentStatus",
      headerName: "Comp Status",
      width: 110,
      valueGetter: (_, row) =>
        // @ts-ignore
        row?.tblComponentUnit?.tblCompStatus?.compStatusName,
    },
    { field: "priority", headerName: "Priority", width: 70 },
    dataGridActionColumn({
      onEdit: handleEdit,
      onDelete: handleDelete,
    }),
  ];

  const updateStatus = async (statusId: number) => {
    if (!selectedRow) return;

    await tblWorkOrder.update(selectedRow.workOrderId, {
      tblWorkOrderStatus: {
        connect: {
          workOrderStatusId: statusId,
        },
      },
    });

    handleRefresh();
  };

  const handleIssue = () => updateStatus(3);
  const handleComplete = () => updateStatus(5);
  const handlePending = () => updateStatus(4);
  const handlePostponed = () => updateStatus(8);
  const handleCancel = () => updateStatus(7);
  const handleRequest = () => updateStatus(1);

  const handleReschedule = () => {};
  const handleReport = () => {};

  return (
    <>
      <Splitter horizontal initialPrimarySize="45%">
        <TabsComponent workOrder={selectedRow} />

        <CustomizedDataGrid
          showToolbar
          disableDensity
          label="WorkOrders"
          loading={loading}
          onRefreshClick={handleRefresh}
          getRowId={(row) => row.workOrderId}
          onRowClick={(params) => setSelectedRow(params.row)}
          rows={rows}
          columns={columns}
          toolbarChildren={
            <DataGridActionBar
              actions={[
                {
                  label: "Issue",
                  icon: <AssignmentTurnedInIcon />,
                  onClick: handleIssue,
                  disabled: !selectedRow || loading,
                },
                {
                  label: "Complete",
                  icon: <CheckCircleIcon />,
                  onClick: handleComplete,
                  disabled: !selectedRow || loading,
                },
                {
                  label: "Pending",
                  icon: <HourglassEmptyIcon />,
                  onClick: handlePending,
                  disabled: !selectedRow || loading,
                },
                {
                  label: "Postponed",
                  icon: <ScheduleIcon />,
                  onClick: handlePostponed,
                  disabled: !selectedRow || loading,
                },
                {
                  label: "Report",
                  icon: <ScheduleIcon />,
                  onClick: handleReport,
                  disabled: !selectedRow || loading,
                },
                {
                  label: "Cancel",
                  icon: <ScheduleIcon />,
                  onClick: handleCancel,
                  disabled: !selectedRow || loading,
                },
                {
                  label: "Request",
                  icon: <RequestPageIcon />,
                  onClick: handleRequest,
                  disabled: !selectedRow || loading,
                },
                {
                  label: "Reschedule",
                  icon: <EventRepeatIcon />,
                  onClick: handleReschedule,
                  disabled: !selectedRow || loading,
                },
              ]}
            />
          }
        />
      </Splitter>
      {/* <WorkOrderFilterDialog
        onApplyFilter={() => {}}
        onClose={() => {}}
        open={true}
      /> */}
    </>
  );
}
