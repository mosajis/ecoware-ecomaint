import CustomizedDataGrid from "@/shared/components/dataGrid/DataGrid";
import CellDateTime from "@/shared/components/dataGrid/cells/CellDateTime";
import Splitter from "@/shared/components/Splitter/Splitter";
import Button from "@mui/material/Button";
import MeasurePointsUpdate from "./MeasurePointsUpdate";
import MeasurePointsTrend from "./MeasurePointsTrend";

import { GridColDef, GridRowSelectionModel } from "@mui/x-data-grid";
import { useDataGrid } from "@/shared/hooks/useDataGrid";
import { useCallback, useMemo, useState } from "react";
import {
  columns as logColumns,
  getRowId as logGetRowId,
} from "../measurePointsLogs/MeasurePointsLogsColumns";
import {
  tblCompMeasurePoint,
  tblCompMeasurePointLog,
  TypeTblCompMeasurePoint,
} from "@/core/api/generated/api";
import { BarChartSharp } from "@mui/icons-material";

const getRowId = (row: TypeTblCompMeasurePoint) => row.compMeasurePointId;

const columns: GridColDef<TypeTblCompMeasurePoint>[] = [
  {
    field: "compNo",
    headerName: "Component",
    flex: 1,
    valueGetter: (_, row) => row?.tblComponentUnit?.compNo,
  },
  {
    field: "compType",
    headerName: "Component Type",
    flex: 1,
    // @ts-ignore
    valueGetter: (_, row) => row?.tblComponentUnit?.tblCompType?.compName,
  },

  {
    field: "measureName",
    headerName: "Measurepoint",
    flex: 1,

    valueGetter: (_, row) => row.tblCounterType?.name,
  },

  {
    field: "currentDate",
    headerName: "Current Date",
    width: 130,
    renderCell: ({ value }) => <CellDateTime value={value} />,
  },
  {
    field: "currentValue",
    headerName: "Current Value",
    flex: 1,
  },
  {
    field: "setValue",
    headerName: "Set Value",
  },
  {
    field: "operationalMinValue",
    headerName: "Min Value",
  },

  {
    field: "operationalMaxValue",
    headerName: "Max Value",
  },

  {
    field: "unitDescription",
    headerName: "Unit Descr",
    valueGetter: (_, row) => row.tblUnit?.description,
  },
];

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
          rows={rows}
          columns={columns}
          loading={loading}
          onRefreshClick={handleRefresh}
          getRowId={getRowId}
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
                Update Measure
              </Button>
              <Button
                onClick={() => setOpenTrend(true)}
                disabled={!selectedRowId}
                size="small"
                startIcon={<BarChartSharp />}
              >
                Trend
              </Button>
            </>
          }
        />
        <CustomizedDataGrid
          showToolbar
          disableAdd
          disableEdit
          label={label || "Measure Points Logs"}
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
