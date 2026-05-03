import CustomizedDataGrid from "@/shared/components/dataGrid/DataGrid";
import { useDataGrid } from "@/shared/hooks/useDataGrid";
import { useCallback } from "react";

import { tblCompJob, TypeTblFunction } from "@/core/api/generated/api";
import { columns, getRowId } from "./TabJobColumn";

interface Props {
  recordFunction?: TypeTblFunction;
  label?: string;
}

const TabJob = ({ recordFunction, label }: Props) => {
  const compId = recordFunction?.tblComponentUnit?.compId;

  const getAll = useCallback(
    () =>
      tblCompJob.getAll({
        include: {
          tblPeriod: true,
          tblDiscipline: true,
          tblJobDescription: true,
        },
        filter: {
          compId,
        },
      }),
    [compId],
  );
  // --- useDataGrid ---
  const { rows, loading, handleRefresh } = useDataGrid(
    getAll,
    tblCompJob.deleteById,
    "compJobId",
    !!compId,
  );
  return (
    <>
      <CustomizedDataGrid
        disableRowNumber
        disableAdd
        disableRowSelectionOnClick
        disableEdit
        disableDelete
        showToolbar={!!label}
        label={label}
        rows={rows}
        columns={columns}
        loading={loading}
        onRefreshClick={handleRefresh}
        getRowId={getRowId}
      />
    </>
  );
};

export default TabJob;
