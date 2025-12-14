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
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import { useCallback, useRef, useState } from "react";
import { tblWorkOrder, TypeTblWorkOrder } from "@/core/api/generated/api";
import { useDataGrid } from "@/shared/hooks/useDataGrid";
import { GridColDef } from "@mui/x-data-grid";
import { dataGridActionColumn } from "@/shared/components/dataGrid/DataGridActionsColumn";
import { formatDateTime } from "@/core/api/helper";
import { calculateOverdue } from "./workOrderHelper";
import WorkOrderFilterDialog, {
  type WorkOrderFilter,
} from "./WorkOrderFilterDialog";
import { useReactToPrint } from "react-to-print";
import { ReportPrint } from "./report/ReportPrint";

export default function WorkOrderPage() {
  const [selectedRow, setSelectedRow] = useState<TypeTblWorkOrder | null>(null);
  const [filter, setFilter] = useState<WorkOrderFilter | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);

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

  const { rows, loading, handleRefresh, handleDelete } = useDataGrid(
    getAll,
    tblWorkOrder.deleteById,
    "workOrderId"
  );

  /* ---------- Columns ---------- */

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
        if (params.value === "") return "";
        const color = params.value < 0 ? "red" : "green";
        return <span style={{ color, fontWeight: 600 }}>{params.value}</span>;
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
    dataGridActionColumn({
      onEdit: (row) => setSelectedRow(row),
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

  // multiple select
  // issue => باز کردن مودال نمایش ریپورت و اوکی
  // complete => باز کردن ریپورت اوکی و تغییر وضعیت
  // pend => چگ از روی نرم افزار
  // postponed =>  چگ از روی نرم افزار
  // cancel => empty
  // request =>  چگ از روی نرم افزار
  // reschedule =>  چگ از روی نرم افزار

  const contentRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef,
  });

  return (
    <>
      <Splitter horizontal initialPrimarySize="40%">
        {/* <TabsComponent workOrder={selectedRow} /> */}

        <div>
          <button onClick={handlePrint}>Print</button>

          {/* مخفی روی صفحه، فقط برای پرینت */}
          <div style={{ display: "none" }}>
            <ReportPrint
              ref={contentRef}
              workOrders={
                selectedRow
                  ? [
                      selectedRow as any,
                      selectedRow as any,
                      selectedRow as any,
                      selectedRow as any,
                      selectedRow as any,
                    ]
                  : []
              }
            />
          </div>
        </div>
        <CustomizedDataGrid
          showToolbar
          disableDensity
          label="WorkOrders"
          loading={loading}
          rows={rows}
          columns={columns}
          getRowId={(row) => row.workOrderId}
          onRowClick={(params) => setSelectedRow(params.row)}
          onRefreshClick={handleRefresh}
          toolbarChildren={
            <DataGridActionBar
              actions={[
                {
                  label: "Filter",
                  icon: <FilterAltIcon />,
                  variant: filter ? "contained" : "text",
                  onClick: () => setFilterOpen(true),
                },
                {
                  label: "Issue",
                  icon: <AssignmentTurnedInIcon />,
                  onClick: () => updateStatus(3),
                  disabled: !selectedRow || loading, // only plan or request enable
                },
                {
                  label: "Complete",
                  icon: <CheckCircleIcon />,
                  onClick: () => updateStatus(5),
                  disabled: !selectedRow || loading, // plan control complete cancel disable
                },
                {
                  label: "Pending",
                  icon: <HourglassEmptyIcon />,
                  onClick: () => updateStatus(4),
                  disabled: !selectedRow || loading, // only issue enable
                },
                {
                  label: "Postponed",
                  icon: <ScheduleIcon />,
                  onClick: () => updateStatus(8),
                  disabled: !selectedRow || loading, // only pend or issue enable
                },
                {
                  label: "Cancel",
                  icon: <ScheduleIcon />,
                  onClick: () => updateStatus(7),
                  disabled: !selectedRow || loading, // همیشه فعال
                },
                {
                  label: "Request",
                  icon: <RequestPageIcon />,
                  onClick: () => updateStatus(1),
                  disabled: !selectedRow || loading, // همیشه فعال
                },
                {
                  label: "Reschedule",
                  icon: <EventRepeatIcon />,
                  onClick: () => {},
                  disabled: !selectedRow || loading, // complete control disable
                },
              ]}
            />
          }
        />
      </Splitter>

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
