import Splitter from "@/shared/components/Splitter/Splitter";
import CustomizedDataGrid from "@/shared/components/dataGrid/DataGrid";
import FormControlLabel from "@mui/material/FormControlLabel";
import CountersUpdate from "./CounterUpdate";
import Checkbox from "@mui/material/Checkbox";
import Actions from "./CounterActions";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { GridColDef, GridRowSelectionModel } from "@mui/x-data-grid";
import { useDataGrid } from "@/shared/hooks/useDataGrid";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { buildColumns, getRowId } from "./CounterColumns";
import { TypeTblCompCounter } from "@/core/api/generated/api";
import { api } from "@/service/axios";
import {
  columns as logColumns,
  getRowId as logGetRowId,
} from "../counterLog/CounterLogColumns";
import {
  tblCompCounter,
  tblCompCounterLog,
  tblCounterType,
} from "@/core/api/generated/api";

const getMtbf = async (compCounterId: number) => {
  return api.get("/tblCompCounterLog/mtbf", { params: { compCounterId } });
};

/* ================= Page ================= */
export default function PageCounterUpdate() {
  const [showAll, setShowAll] = useState(false);
  const [openForm, setOpenForm] = useState(false);
  const [mtbfMap, setMtbfMap] = useState<Record<number, number | null>>({});
  const [mtbfLoading, setMtbfLoading] = useState(false);
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
            tblComponentUnit: {
              is: {
                statusId: {
                  notIn: [5, 6],
                },
              },
            },
          },
      include: {
        tblCounterType: true,
        tblComponentUnit: true,
        tblEmployee: true,
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
    [rows, selectedRowId],
  );

  const label = selectedRow?.tblCounterType?.name ?? null;

  const mtbfMapRef = useRef(mtbfMap);

  useEffect(() => {
    mtbfMapRef.current = mtbfMap;
  }, [mtbfMap]);

  const mtbfColumn = useMemo<GridColDef<TypeTblCompCounter>>(
    () => ({
      field: "mtbf",
      headerName: "MTBF",
      width: 110,
      renderCell: ({ row }) => mtbfMap[row.compCounterId] ?? "-",
    }),
    [mtbfMap],
  );

  const columns = useMemo(() => [...buildColumns(), mtbfColumn], [mtbfColumn]);

  /* === Logs Grid === */
  const logGetAll = useCallback(() => {
    return tblCompCounterLog.getAll({
      filter: {
        compCounterId: selectedRowId,
      },
      sort: "compCounterLogId:desc",
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

  /* === Calc MTBF === */
  const handleCalcMtbf = useCallback(async () => {
    if (!selectedRowId) return;
    setMtbfLoading(true);
    try {
      const result = await getMtbf(selectedRowId);

      setMtbfMap((prev) => ({
        ...prev,
        [selectedRowId]: result?.mtbf,
      }));
    } catch (err) {
      console.error(err);
    } finally {
      setMtbfLoading(false);
    }
  }, [selectedRowId]);

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
          elementId={1370}
          loading={loading}
          rows={rows}
          columns={columns}
          getRowId={getRowId}
          onRefreshClick={handleRefresh}
          rowSelectionModel={rowSelectionModel}
          onRowSelectionModelChange={setRowSelectionModel}
          toolbarChildren={
            <Actions
              selectedRowId={selectedRow}
              onClickUpdate={() => setOpenForm(true)}
            >
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
              <Button
                variant="outlined"
                disabled={!selectedRowId || mtbfLoading}
                onClick={handleCalcMtbf}
                startIcon={
                  mtbfLoading ? <CircularProgress size={14} /> : undefined
                }
              >
                Calc MTBF
              </Button>
            </Actions>
          }
        />

        <CustomizedDataGrid
          showToolbar
          disableAdd
          disableEdit
          onDeleteClick={handleDelete}
          label={label || "Counter Log"}
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
