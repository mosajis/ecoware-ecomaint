import CustomizedDataGrid from "@/shared/components/dataGrid/DataGrid";
import { useDataGrid } from "@/shared/hooks/useDataGrid";
import { useCallback } from "react";
import { tblMaintLog, TypeTblMaintLog } from "@/core/api/generated/api";
import { columns, getRowId } from "./TabComponentLogColumns";

interface Props {
  selected?: TypeTblMaintLog;
  label?: string;
}

const TabComponentLog = (props: Props) => {
  const { selected, label } = props;

  const compId = selected?.tblComponentUnit?.compId;
  const maintLogId = selected?.maintLogId;

  const getAll = useCallback(
    () =>
      tblMaintLog.getAll({
        filter: {
          compId: compId,
        },
        sort: "dateDone:desc",

        include: {
          tblComponentUnit: {
            include: {
              tblCompStatus: true,
            },
          },
          tblFollowStatus: true,
          tblJobDescription: true,
          tblMaintClass: true,
        },
      }),
    [compId],
  );

  // === useDataGrid ===
  const { rows, loading, handleRefresh } = useDataGrid(
    getAll,
    tblMaintLog.deleteById,
    "maintLogId",
    !!maintLogId,
  );

  return (
    <CustomizedDataGrid
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

export default TabComponentLog;
