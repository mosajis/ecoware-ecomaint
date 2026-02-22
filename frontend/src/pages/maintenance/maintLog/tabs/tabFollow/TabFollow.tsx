import CustomizedDataGrid from "@/shared/components/dataGrid/DataGrid";
import { useCallback } from "react";
import { useDataGrid } from "@/shared/hooks/useDataGrid";
import { tblMaintLogFollow, TypeTblMaintLog } from "@/core/api/generated/api";
import { columns, getRowId } from "./TabFollowColumns";

type props = {
  selected: TypeTblMaintLog;
  label?: string;
};

const TabFollow = (props: props) => {
  const { label, selected } = props;

  // === DataGrid ===
  const getAll = useCallback(() => {
    return tblMaintLogFollow.getAll({
      filter: {
        maintLogId: selected.maintLogId,
      },
      include: {
        tblFollowStatus: true,
        tblUsers: {
          include: {
            tblEmployeeTblUsersEmployeeIdTotblEmployee: true,
          },
        },
      },
    });
  }, [selected?.maintLogId]);

  const { rows, loading, handleRefresh, handleDelete } = useDataGrid(
    getAll,
    tblMaintLogFollow.deleteById,
    "followId",
    !!selected?.maintLogId,
  );

  return (
    <CustomizedDataGrid
      showToolbar
      disableRowSelectionOnClick
      disableAdd
      disableEdit
      disableDelete
      label={label || "Follow"}
      columns={columns}
      loading={loading}
      rows={rows}
      getRowId={getRowId}
      onRefreshClick={handleRefresh}
    />
  );
};

export default TabFollow;
