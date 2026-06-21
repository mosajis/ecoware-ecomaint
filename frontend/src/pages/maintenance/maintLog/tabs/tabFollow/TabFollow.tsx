import CustomizedDataGrid from "@/shared/components/dataGrid/DataGrid";
import Splitter from "@/shared/components/Splitter/Splitter";
import Editor from "@/shared/components/Editor";
import { useCallback, useState } from "react";
import { useDataGrid } from "@/shared/hooks/useDataGrid";
import {
  tblMaintLogFollow,
  TypeTblMaintLog,
  TypeTblMaintLogFollow,
} from "@/core/api/generated/api";
import { columns, getRowId } from "./TabFollowColumns";

type props = {
  selected: TypeTblMaintLog;
  label?: string;
};

const TabFollow = (props: props) => {
  const { label, selected } = props;
  const [selectedDesc, setSelectedDesc] = useState<string | null>(null);

  // === DataGrid ===
  const getAll = useCallback(() => {
    return tblMaintLogFollow.getAll({
      filter: {
        maintLogId: selected.maintLogId,
      },
      include: {
        tblFollowStatus: true,
        tblEmployee: true,
      },
    });
  }, [selected?.maintLogId]);

  const { rows, loading, handleRefresh } = useDataGrid(
    getAll,
    tblMaintLogFollow.deleteById,
    "followId",
    !!selected?.maintLogId,
  );

  const handleRowClick = useCallback(
    ({ row }: { row: TypeTblMaintLogFollow }) => {
      setSelectedDesc(row.followDesc);
    },
    [],
  );

  return (
    <Splitter initialPrimarySize="60%">
      <CustomizedDataGrid
        showToolbar={!!selected?.maintLogId}
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
        onRowClick={handleRowClick}
      />

      <Editor label="Follow Desc" readOnly disabled initValue={selectedDesc} />
    </Splitter>
  );
};

export default TabFollow;
