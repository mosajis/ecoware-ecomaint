import CustomizedDataGrid from "@/shared/components/dataGrid/DataGrid";
import { useDataGrid } from "@/shared/hooks/useDataGrid";
import { useCallback } from "react";
import { columns } from "@/pages/report/failureReport/FailureReportColumns";
import {
  tblFailureReports,
  tblMaintCause,
  TypeTblFailureReports,
  TypeTblFunction,
} from "@/core/api/generated/api";

interface Props {
  recordFunction?: TypeTblFunction;
  label?: string;
}

const getRowId = (row: TypeTblFailureReports) => row.failureReportId;

export default function TabFailureReport({ label, recordFunction }: Props) {
  const compId = recordFunction?.tblComponentUnit?.compId;

  const getAll = useCallback(
    () =>
      tblFailureReports.getAll({
        filter: {
          tblMaintLog: {
            // compId,
          },
        },
        include: {
          tblMaintLog: {
            include: {
              tblMaintCause: true,
              tblComponentUnit: true,
              tblDiscipline: true,
              tblUsersTblMaintLogReportedByTotblUsers: {
                include: { tblEmployeeTblUsersEmployeeIdTotblEmployee: true },
              },
            },
          },
          tblFailureSeverityLevel: true,
          tblFailureStatus: true,
          tblFailureGroupFollow: true,
          tblUsers: true,
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
