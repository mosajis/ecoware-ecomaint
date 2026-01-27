import CustomizedDataGrid from "@/shared/components/dataGrid/DataGrid";
import { useDataGrid } from "@/shared/hooks/useDataGrid";
import { useCallback } from "react";
import { columns } from "../../maintLog/MaintLogColumns";
import {
  tblMaintLog,
  TypeTblFunctions,
  TypeTblMaintLog,
} from "@/core/api/generated/api";

interface Props {
  recordFunction?: TypeTblFunctions;
  label?: string;
}
const getRowId = (row: TypeTblMaintLog) => row.maintLogId;

const TabMaintLog = (props: Props) => {
  const { recordFunction, label } = props;

  const compId = recordFunction?.tblComponentUnit?.compId;

  const getAll = useCallback(
    () =>
      tblMaintLog.getAll({
        filter: {
          compId: compId,
        },
        include: {
          tblWorkOrder: {
            include: {
              tblDiscipline: true,
            },
          },
          tblFollowStatus: true,
          tblComponentUnit: true,
          tblMaintClass: true,
          tblJobDescription: true,
        },
      }),
    [compId],
  );
  // === useDataGrid ===
  const { rows, loading, handleRefresh } = useDataGrid(
    getAll,
    tblMaintLog.deleteById,
    "maintLogId",
    !!compId,
  );

  return (
    <CustomizedDataGrid
      disableRowSelectionOnClick
      disableRowNumber
      disableAdd
      disableEdit
      disableDelete
      showToolbar={!!label}
      label={label}
      loading={loading}
      onRefreshClick={handleRefresh}
      getRowId={getRowId}
      rows={rows}
      columns={columns}
    />
  );
};

export default TabMaintLog;
