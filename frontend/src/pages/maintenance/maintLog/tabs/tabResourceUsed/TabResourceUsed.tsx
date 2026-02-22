import CustomizedDataGrid from "@/shared/components/dataGrid/DataGrid";
import { useDataGrid } from "@/shared/hooks/useDataGrid";
import { useCallback } from "react";
import { columns, getRowId } from "./TabResourceUsedColumns";
import { tblLogDiscipline, TypeTblMaintLog } from "@/core/api/generated/api";

type Props = {
  selected: TypeTblMaintLog;
  label?: string;
};

const TabResourceUsed = (props: Props) => {
  const { selected, label } = props;

  const getAll = useCallback(() => {
    return tblLogDiscipline.getAll({
      filter: {
        maintLogId: selected?.maintLogId,
      },
      include: {
        tblDiscipline: true,
        tblEmployee: true,
      },
    });
  }, [selected?.maintLogId]);

  const { rows, loading } = useDataGrid(
    getAll,
    tblLogDiscipline.deleteById,
    "logDiscId",
    !!selected?.maintLogId,
  );

  return (
    <CustomizedDataGrid
      label={label || "Resource Used"}
      showToolbar
      disableAdd
      disableEdit
      disableDelete
      disableRowSelectionOnClick
      loading={loading}
      rows={rows}
      columns={columns}
      getRowId={getRowId}
    />
  );
};

export default TabResourceUsed;
