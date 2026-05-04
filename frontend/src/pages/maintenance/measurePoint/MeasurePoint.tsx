import CustomizedDataGrid from "@/shared/components/dataGrid/DataGrid";
import Splitter from "@/shared/components/Splitter/Splitter";
import MeasurePointsUpdate from "./MeasurePointUpdate";
import MeasurePointsTrend from "./MeasurePointTrend";
import Actions from "./MeasurePointActions";

import { columns, getRowId } from "./MeasurePointColumn";
import { GridRowSelectionModel } from "@mui/x-data-grid";
import { useDataGrid } from "@/shared/hooks/useDataGrid";
import { useCallback, useMemo, useState } from "react";
import {
  columns as logColumns,
  getRowId as logGetRowId,
} from "../measurePointLog/MeasurePointLogColumn";
import {
  tblCompMeasurePoint,
  tblCompMeasurePointLog,
} from "@/core/api/generated/api";

function PageMeasurePoints() {
  const [openForm, setOpenForm] = useState(false);
  const [openTrend, setOpenTrend] = useState(false);
  const [rowSelectionModel, setRowSelectionModel] =
    useState<GridRowSelectionModel>({
      type: "include",
      ids: new Set(),
    });

  const selectedRowId = useMemo(() => {
    const ids = Array.from(rowSelectionModel.ids);
    return ids.length === 1 ? Number(ids[0]) : null;
  }, [rowSelectionModel]);

  const getAll = useCallback(
    () =>
      tblCompMeasurePoint.getAll({
        filter: {
          tblCounterType: {
            type: 3,
          },
        },
        include: {
          tblUnit: true,
          tblCounterType: true,
          tblComponentUnit: {
            include: {
              tblCompType: true,
            },
          },
        },
      }),
    [],
  );

  const { rows, loading, handleRefresh } = useDataGrid(
    getAll,
    tblCompMeasurePoint.deleteById,
    "compMeasurePointId",
  );

  const logGetAll = useCallback(
    () =>
      tblCompMeasurePointLog.getAll({
        filter: {
          compMeasurePointId: selectedRowId,
        },
        include: {
          tblUnit: true,
          tblCompMeasurePoint: {
            include: {
              tblCounterType: true,
              tblComponentUnit: {
                include: {
                  tblCompType: true,
                },
              },
            },
          },
        },
      }),
    [selectedRowId],
  );

  const {
    rows: logRows,
    loading: logLoading,
    handleRefresh: logHandleRefresh,
    handleDelete,
  } = useDataGrid(
    logGetAll,
    tblCompMeasurePointLog.deleteById,
    "compMeasurePointLogId",
    !!selectedRowId,
  );

  const selectedRow = useMemo(
    () => rows.find((r) => r.compMeasurePointId === selectedRowId),
    [selectedRowId],
  );

  const label = selectedRow?.tblComponentUnit?.compNo ?? null;

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
          disableEdit
          disableDelete
          label="Measure Points"
          elementId={1400}
          rows={rows}
          columns={columns}
          loading={loading}
          rowSelectionModel={rowSelectionModel}
          onRefreshClick={handleRefresh}
          getRowId={getRowId}
          onRowSelectionModelChange={setRowSelectionModel}
          toolbarChildren={
            <Actions
              selectedRow={selectedRow}
              onClickTrend={() => setOpenTrend(true)}
              onClickUpdate={() => setOpenForm(true)}
            />
          }
        />
        <CustomizedDataGrid
          showToolbar
          disableAdd
          disableEdit
          elementId={1400}
          label={label || "Measure Point Log"}
          rows={logRows}
          columns={logColumns}
          loading={logLoading}
          onDeleteClick={handleDelete}
          onRefreshClick={logHandleRefresh}
          getRowId={logGetRowId}
        />
      </Splitter>
      <MeasurePointsTrend
        open={openTrend}
        onClose={() => setOpenTrend(false)}
        compMeasurePointId={selectedRowId}
        title={selectedRow?.tblComponentUnit?.compNo || ""}
      />
      <MeasurePointsUpdate
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

export default PageMeasurePoints;
