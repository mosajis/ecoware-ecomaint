import Splitter from "@/shared/components/Splitter";
import TabsComponent from "./WorkOrderTabs";
import CustomizedDataGrid from "@/shared/components/dataGrid/DataGrid";
import { useCallback } from "react";
import { tblWorkOrder, TypeTblWorkOrder } from "@/core/api/generated/api";
import { useDataGrid } from "@/shared/hooks/useDataGrid";
import { GridColDef } from "@mui/x-data-grid";
import DataGridActionBar from "@/shared/components/dataGrid/DataGridActionBar";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import TuneIcon from "@mui/icons-material/Tune";
import CancelIcon from "@mui/icons-material/Cancel";
import RequestPageIcon from "@mui/icons-material/RequestPage";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import EventRepeatIcon from "@mui/icons-material/EventRepeat";
import HandshakeIcon from "@mui/icons-material/Handshake";
import ScheduleIcon from "@mui/icons-material/Schedule";

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
    width: 150,
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
  { field: "dueDate", headerName: "Due Date", flex: 1 },
  { field: "completed", headerName: "Completed Date", flex: 1 },
  { field: "overDue (w-Rel)", headerName: "OverDue", flex: 1 },
  {
    field: "pendingType",
    headerName: "Pending Type",
    flex: 1,
    valueGetter: (_, row) => row?.tblPendingType?.pendTypeName,
  },
  { field: "pendingdate", headerName: "Pending Date", flex: 1 },
  {
    field: "triggeredBy",
    headerName: "Triggered By (W-Rel)",
    flex: 1,
  },
  {
    field: "componentStatus",
    headerName: "Comp Status",
    flex: 1,
    valueGetter: (_, row) =>
      // @ts-ignore
      row?.tblComponentUnit?.tblCompStatus?.compStatusName,
  },
  { field: "priority", headerName: "Priority", width: 70 },
];

export default function WorkOrderPage() {
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
  // === useDataGrid ===
  const { rows, loading, handleRefresh } = useDataGrid(
    getAll,
    tblWorkOrder.deleteById,
    "workOrderId"
  );

  return (
    <Splitter horizontal initialPrimarySize="45%">
      <TabsComponent />

      <CustomizedDataGrid
        showToolbar
        disableDensity
        label="WorkOrders"
        loading={loading}
        onRefreshClick={handleRefresh}
        getRowId={(row) => row.workOrderId}
        rows={rows}
        columns={columns}
        toolbarChildren={
          <DataGridActionBar
            actions={[
              { label: "Issue", icon: <AssignmentTurnedInIcon /> },
              { label: "Complete", icon: <CheckCircleIcon /> },
              { label: "Pending", icon: <HourglassEmptyIcon /> },
              { label: "Postponed", icon: <ScheduleIcon /> },
              { label: "Report", icon: <ScheduleIcon /> },
              // { label: "Cancel", icon: <ScheduleIcon /> }, // m
              // { label: "Request", icon: <RequestPageIcon /> }, // m
              // { label: "Reschedule", icon: <EventRepeatIcon /> }, // m
            ]}
          />
        }
      />
    </Splitter>
  );
}
