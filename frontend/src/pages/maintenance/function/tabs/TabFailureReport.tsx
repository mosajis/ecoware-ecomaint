import CustomizedDataGrid from "@/shared/components/dataGrid/DataGrid";
import { useDataGrid } from "@/shared/hooks/useDataGrid";
import { useCallback } from "react";
import {
  tblFailureReports,
  TypeTblFailureReports,
  TypeTblFunctions,
} from "@/core/api/generated/api";
import { columns } from "@/pages/report/reportFailure/ReportFailure";

interface Props {
  recordFunction?: TypeTblFunctions;
  label?: string;
}

const getRowId = (row: TypeTblFailureReports) => row.failureReportId;

export default function TabFailureReport({ label, recordFunction }: Props) {
  const compId = recordFunction?.tblComponentUnit?.compId;

  const getAll = useCallback(
    () =>
      tblFailureReports.getAll({
        filter: {
          compId,
        },
        include: {
          tblComponentUnit: true,
          tblDiscipline: true,
          tblFailureSeverityLevel: true,
          tblFailureStatus: true,
          tblFailureGroupFollow: true,
          tblUsersTblFailureReportsReportedUserIdTotblUsers: true,
          tblUsersTblFailureReportsApprovedUserIdTotblUsers: true,
          tblUsersTblFailureReportsClosedUserIdTotblUsers: true,
        },
      }),
    [compId],
  );

  const { rows, loading, handleRefresh } = useDataGrid(
    getAll,
    tblFailureReports.deleteById,
    "failureReportId",
    !!compId,
  );

  return (
    <CustomizedDataGrid
      disableRowNumber
      disableAdd
      disableRowSelectionOnClick
      disableEdit
      disableDelete
      showToolbar={!!label}
      label={label}
      loading={loading}
      rows={rows}
      columns={columns}
      onRefreshClick={handleRefresh}
      getRowId={getRowId}
    />
  );
}
