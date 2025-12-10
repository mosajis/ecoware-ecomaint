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
    flex: 1,
    // @ts-ignore
    valueGetter: (_, row) => row?.tblCompJob?.tblJobDescription?.jobDescCode,
  },
  {
    field: "component",
    headerName: "Component",
    flex: 1,
    valueGetter: (_, row) => row.tblComponentUnit?.compNo,
  },
  {
    field: "location",
    headerName: "Location",
    flex: 1,
    // @ts-ignore
    valueGetter: (_, row) => row?.tblComponentUnit?.tblLocation?.name,
  },
  {
    field: "jobDescTitle",
    headerName: "JobDescTitle",
    flex: 1,
    // @ts-ignore
    valueGetter: (_, row) => row?.tblCompJob?.tblJobDescription?.jobDescTitle,
  },
  {
    field: "disipline",
    headerName: "Disipline",
    flex: 1,
    valueGetter: (_, row) => row?.tblDiscipline?.name,
  },
  {
    field: "status",
    headerName: "Status (W-Rel)",
    flex: 1,
  },
  { field: "dueDate", headerName: "Due Date", flex: 1 },
  { field: "completedDate", headerName: "Completed Date", flex: 1 },
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
    headerName: "Component Status",
    flex: 1,
    valueGetter: (_, row) =>
      // @ts-ignore
      row?.tblComponentUnit?.tblCompStatus?.compStatusName,
  },
  { field: "priority", headerName: "Priority", flex: 1 },
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
              { label: "Control", icon: <TuneIcon /> },
              { label: "Cancel", icon: <CancelIcon /> },
              { label: "Request", icon: <RequestPageIcon /> },
              { label: "Forward", icon: <ArrowForwardIcon /> },
              { label: "Reschedule", icon: <EventRepeatIcon /> },
              { label: "HandOver", icon: <HandshakeIcon /> },
              { label: "Postponed", icon: <ScheduleIcon /> },
            ]}
          />
        }
      />
    </Splitter>
  );
}
