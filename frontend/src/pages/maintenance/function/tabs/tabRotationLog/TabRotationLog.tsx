import CustomizedDataGrid from "@/shared/components/dataGrid/DataGrid";
import CellDateTime from "@/shared/components/dataGrid/cells/CellDateTime";
import { useCallback } from "react";
import { useDataGrid } from "@/shared/hooks/useDataGrid";
import { GridColDef } from "@mui/x-data-grid";
import {
  tblRotationLog,
  TypeTblFunction,
  TypeTblRotationLog,
} from "@/core/api/generated/api";
import { columns, getRowId } from "./TabRotationLogColumn";

interface Props {
  recordFunction?: TypeTblFunction;
  label?: string;
}

const TabRotationLog = ({ recordFunction, label }: Props) => {
  const functionId = recordFunction?.functionId;

  const getAll = useCallback(
    () =>
      tblRotationLog.getAll({
        include: {
          tblComponentUnit: true,
        },
        filter: {
          functionId: functionId,
        },
      }),
    [functionId],
  );

  const { rows, loading, handleRefresh } = useDataGrid(
    getAll,
    tblRotationLog.deleteById,
    "rotationLogId",
    !!functionId,
  );

  return (
    <CustomizedDataGrid
      label={label}
      disableAdd
      disableRowSelectionOnClick
      disableEdit
      disableDelete
      showToolbar={!!label}
      rows={rows}
      columns={columns}
      loading={loading}
      onRefreshClick={handleRefresh}
      getRowId={getRowId}
    />
  );
};

export default TabRotationLog;
