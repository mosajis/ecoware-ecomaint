import Splitter from "@/shared/components/Splitter/Splitter";
import CellDateTime from "@/shared/components/dataGrid/cells/CellDateTime";
import CustomizedDataGrid from "@/shared/components/dataGrid/DataGrid";
import Button from "@mui/material/Button";
import FormControlLabel from "@mui/material/FormControlLabel";
import CountersUpdate from "./CountersUpdate";
import Checkbox from "@mui/material/Checkbox";
import { GridColDef, GridRowSelectionModel } from "@mui/x-data-grid";
import { useCallback, useMemo, useState } from "react";
import { useDataGrid } from "@/shared/hooks/useDataGrid";
import {
  columns as logColumns,
  getRowId as logGetRowId,
} from "../countersLogs/CountersLogsColumns";
import {
  tblCompCounter,
  tblCompCounterLog,
  tblComponentUnit,
  tblCounterType,
  TypeTblCompCounter,
  TypeTblCompCounterLog,
} from "@/core/api/generated/api";

const getRowId = (row: TypeTblCompCounter) => row.compCounterId;

const columns: GridColDef<TypeTblCompCounter>[] = [
  {
    field: "component",
    headerName: "component",
    flex: 1,
    valueGetter: (_, row) => row.tblComponentUnit?.compNo,
  },
  {
    field: "counterType",
    headerName: "Counter Type",
    flex: 1,
    valueGetter: (_, row) => row.tblCounterType?.name || "",
  },
  {
    field: "currentDate",
    headerName: "Current Date",
    flex: 1,
    renderCell: ({ value }) => <CellDateTime value={value} />,
  },
  {
    field: "currentValue",
    headerName: "Current Value",
    flex: 1,
  },
  {
    field: "startDate",
    headerName: "Start Date",
    flex: 1,
    renderCell: ({ value }) => <CellDateTime value={value} />,
  },
  {
    field: "startValue",
    headerName: "Start Value",
    flex: 1,
  },
  {
    field: "useCalcAverage",
    headerName: "Use Calc Avg",
    width: 120,
    type: "boolean",
  },
  {
    field: "averageCountRate",
    headerName: "Avg Rate",
    flex: 1,
  },
  {
    field: "orderNo",
    headerName: "Order No",
    width: 85,
  },
];
/* ================= Page ================= */
export default function PageCounterUpdate() {
  const [showAll, setShowAll] = useState(false);
  const [openForm, setOpenForm] = useState(false);
  const [rowSelectionModel, setRowSelectionModel] =
    useState<GridRowSelectionModel>({
      type: "include",
      ids: new Set(),
    });

  /* === Selected Row Id (derived) === */
  const selectedRowId = useMemo(() => {
    const ids = Array.from(rowSelectionModel.ids);
    return ids.length === 1 ? Number(ids[0]) : null;
  }, [rowSelectionModel]);

  const getAll = useCallback(() => {
    return tblCompCounter.getAll({
      filter: showAll
        ? undefined
        : {
            dependsOnId: null,
          },
      include: {
        tblCounterType: true,
        tblComponentUnit: true,
      },
    });
  }, [showAll]);

  const { rows, loading, handleRefresh } = useDataGrid(
    getAll,
    tblCounterType.deleteById,
    "counterTypeId",
  );

  const selectedRow = useMemo(
    () => rows.find((r) => r.compCounterId === selectedRowId),
    [selectedRowId],
  );

  const label = selectedRow?.tblCounterType?.name ?? null;

  /* === Logs Grid === */
  const logGetAll = useCallback(() => {
    return tblCompCounterLog.getAll({
      filter: {
        compCounterId: selectedRowId,
      },
      include: {
        tblCompCounter: {
          include: {
            tblCounterType: true,
            tblComponentUnit: true,
          },
        },
      },
    });
  }, [selectedRowId]);

  const {
    rows: logRows,
    loading: logLoading,
    handleRefresh: logHandleRefresh,
    handleDelete,
  } = useDataGrid(
    logGetAll,
    tblCompCounterLog.deleteById,
    "compCounterLogId",
    !!selectedRowId,
  );

  /* ================= Render ================= */
  return (
    <>
      <Splitter
        horizontal
        initialPrimarySize="50%"
        resetOnDoubleClick
        minPrimarySize="20%"
        minSecondarySize="20%"
      >
        <CustomizedDataGrid
          showToolbar
          disableAdd
          disableDelete
          disableEdit
          label="Counters"
          loading={loading}
          rows={rows}
          columns={columns}
          getRowId={getRowId}
          onRefreshClick={handleRefresh}
          rowSelectionModel={rowSelectionModel}
          onRowSelectionModelChange={setRowSelectionModel}
          toolbarChildren={
            <>
              <Button
                sx={{ ml: 3 }}
                onClick={() => setOpenForm(true)}
                disabled={!selectedRowId}
                variant={!selectedRow ? "text" : "contained"}
                size="small"
              >
                Update Counter
              </Button>
              <FormControlLabel
                control={
                  <Checkbox
                    size="small"
                    checked={showAll}
                    onChange={(_, checked) => setShowAll(checked)}
                  />
                }
                label="Show All"
              />
            </>
          }
        />

        <CustomizedDataGrid
          showToolbar
          disableAdd
          disableEdit
          onDeleteClick={handleDelete}
          label={label || "Counters Logs"}
          loading={logLoading}
          rows={logRows}
          columns={logColumns}
          onRefreshClick={logHandleRefresh}
          getRowId={logGetRowId}
        />
      </Splitter>

      {/* ===== Update Dialog ===== */}
      <CountersUpdate
        open={openForm}
        recordId={selectedRowId}
        onClose={() => setOpenForm(false)}
        onSuccess={() => {
          handleRefresh();
          logHandleRefresh();
        }}
      />
    </>
  );
}
