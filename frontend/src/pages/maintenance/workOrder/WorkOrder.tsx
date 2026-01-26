import ReportPrintDialog from "./WorkOrderDialogReport";
import WorkOrderActionBar from "./WorkOrderActions";
import Splitter from "@/shared/components/Splitter/Splitter";
import CustomizedDataGrid from "@/shared/components/dataGrid/DataGrid";
import TabsComponent from "./WorkOrderTabs";
import { useCallback, useMemo, useState } from "react";
import { columns } from "./WorkOrderColumns";
import { tblWorkOrder, TypeTblWorkOrder } from "@/core/api/generated/api";
import { useDataGrid } from "@/shared/hooks/useDataGrid";
import { GridRowId, GridRowSelectionModel } from "@mui/x-data-grid";
import { TypeTblWorkOrderWithRels } from "./types";
import WorkOrderFilterDialog, {
  type WorkOrderFilter,
} from "./WorkOrderDialogFilter";

const getRowId = (row: TypeTblWorkOrder) => row.workOrderId;

export default function WorkOrderPage() {
  const [dialogIssue, setDialogIssue] = useState(false);
  const [dialogFilter, setDialogFilter] = useState(false);

  const [filter, setFilter] = useState<WorkOrderFilter | null>(null);
  const [selectedRows, setSelectedRows] = useState<GridRowId[]>([]);

  const getAll = useCallback(
    () =>
      tblWorkOrder.getAll({
        paginate: true,
        perPage: 200,
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
    [filter],
  );

  const { rows, loading, handleRefresh } =
    useDataGrid<TypeTblWorkOrderWithRels>(
      getAll,
      tblWorkOrder.deleteById,
      "workOrderId",
    );

  const selectedWorkOrders = useMemo<TypeTblWorkOrderWithRels[]>(() => {
    return rows.filter((r) => selectedRows.includes(r.workOrderId));
  }, [selectedRows, rows]);

  const selectedStatuses = selectedWorkOrders
    .map((w) => w.tblWorkOrderStatus?.name)
    .filter((w) => w !== undefined);

  const openDialogIssue = useCallback(() => {
    setDialogIssue(true);
  }, []);

  const openDialogFilter = useCallback(() => {
    setDialogFilter(true);
  }, []);

  const closeDialogFilter = useCallback(() => {
    setDialogFilter(false);
  }, []);

  const closeDialogIssue = useCallback(() => {
    setDialogIssue(false);
  }, []);

  const onFilterClick = useCallback(() => {
    openDialogFilter();
  }, []);

  const onIssueClick = useCallback(() => {
    openDialogIssue();
  }, []);

  const onCompleteClick = useCallback(() => {}, []);

  const onPendingClick = useCallback(() => {}, []);

  const onPostponedClick = useCallback(() => {}, []);

  const onCancelClick = useCallback(() => {}, []);

  const onRequestClick = useCallback(() => {}, []);

  const onRescheduleClick = useCallback(() => {}, []);

  const onPrintClick = useCallback(() => {}, []);

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
    [rows],
  );

  const handleSubmitIssue = () => {};

  const handleSubmitFilter = (filter: WorkOrderFilter | null) => {
    setFilter(filter);
    openDialogFilter();
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
          // disableRowSelectionOnClick={false}
          onRowSelectionModelChange={handleRowSelectionChange}
          onRefreshClick={handleRefresh}
          toolbarChildren={
            <WorkOrderActionBar
              selectedStatuses={selectedStatuses}
              onFilter={onFilterClick}
              onIssue={onIssueClick}
              onComplete={onCompleteClick}
              onPending={onPendingClick}
              onPostponed={onPostponedClick}
              onCancel={onCancelClick}
              onRequest={onRequestClick}
            />
          }
        />

        <TabsComponent workOrder={selectedWorkOrders[0]} />
      </Splitter>

      <ReportPrintDialog
        title="Issue WorkOrder"
        workOrders={selectedWorkOrders}
        open={dialogIssue}
        onClose={closeDialogIssue}
        onSubmit={handleSubmitIssue}
      />

      <WorkOrderFilterDialog
        open={dialogFilter}
        onClose={closeDialogFilter}
        onSubmit={handleSubmitFilter}
      />
    </>
  );
}
