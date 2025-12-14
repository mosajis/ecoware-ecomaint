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
import { useCallback, useRef, useState } from "react";
import { tblWorkOrder, TypeTblWorkOrder } from "@/core/api/generated/api";
import { useDataGrid } from "@/shared/hooks/useDataGrid";
import { GridColDef, GridRowId } from "@mui/x-data-grid";
import { dataGridActionColumn } from "@/shared/components/dataGrid/DataGridActionsColumn";
import { formatDateTime } from "@/core/api/helper";
import { calculateOverdue } from "./workOrderHelper";
import WorkOrderFilterDialog, {
  type WorkOrderFilter,
} from "./WorkOrderFilterDialog";
import { useReactToPrint } from "react-to-print";
import { ReportPrint } from "./report/ReportPrint";

type GridRowSelectionModel = {
  type: "include" | "exclude";
  ids: Set<GridRowId>;
};

export default function WorkOrderPage() {
  // const [selectedRow, setSelectedRow] = useState<TypeTblWorkOrder | null>(null);

  const [rowSelectionModel, setRowSelectionModel] =
    useState<GridRowSelectionModel>({
      type: "include",
      ids: new Set<GridRowId>(),
    });

  const [selectedRows, setSelectedRows] = useState<TypeTblWorkOrder[]>([]);

  const [filter, setFilter] = useState<WorkOrderFilter | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);

  /* ---------- Data ---------- */

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
    // dataGridActionColumn({
    //   onEdit: (row) => setSelectedRow(row),
    //   onDelete: handleDelete,
    // }),
  ];

  /* ---------- Actions ---------- */

  const updateStatus = async (statusId: number) => {
    if (selectedRows.length === 0) return;

    await Promise.all(
      selectedRows.map((row) =>
        tblWorkOrder.update(row.workOrderId, {
          tblWorkOrderStatus: {
            connect: { workOrderStatusId: statusId },
          },
        })
      )
    );

    handleRefresh();
  };

  /* ---------- Print ---------- */

  const contentRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef,
  });

  /* ---------- Render ---------- */

  return (
    <>
      <Splitter horizontal initialPrimarySize="40%">
        <div>
          <button onClick={handlePrint} disabled={selectedRows.length === 0}>
            Print
          </button>

          {/* فقط برای پرینت */}
          <div style={{ display: "none" }}>
            <ReportPrint ref={contentRef} workOrders={selectedRows} />
          </div>
        </div>

        <CustomizedDataGrid
          rows={rows}
          columns={columns}
          getRowId={(row) => row.workOrderId}
          checkboxSelection
          rowSelectionModel={rowSelectionModel}
          onRowSelectionModelChange={(newModel) => {
            // newModel: GridRowSelectionModel
            setRowSelectionModel(newModel);

            // extract selected rows
            const selectedIds = Array.from(newModel.ids) as number[];
            const selected = rows.filter((r) =>
              selectedIds.includes(r.workOrderId)
            );
            setSelectedRows(selected);
          }}
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
                  disabled: selectedRows.length === 0 || loading,
                },
                {
                  label: "Complete",
                  icon: <CheckCircleIcon />,
                  onClick: () => updateStatus(5),
                  disabled: selectedRows.length === 0 || loading,
                },
                {
                  label: "Pending",
                  icon: <HourglassEmptyIcon />,
                  onClick: () => updateStatus(4),
                  disabled: selectedRows.length === 0 || loading,
                },
                {
                  label: "Postponed",
                  icon: <ScheduleIcon />,
                  onClick: () => updateStatus(8),
                  disabled: selectedRows.length === 0 || loading,
                },
                {
                  label: "Cancel",
                  icon: <ScheduleIcon />,
                  onClick: () => updateStatus(7),
                  disabled: selectedRows.length === 0 || loading,
                },
                {
                  label: "Request",
                  icon: <RequestPageIcon />,
                  onClick: () => updateStatus(1),
                  disabled: selectedRows.length === 0 || loading,
                },
                {
                  label: "Reschedule",
                  icon: <EventRepeatIcon />,
                  onClick: () => {},
                  disabled: selectedRows.length === 0 || loading,
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
