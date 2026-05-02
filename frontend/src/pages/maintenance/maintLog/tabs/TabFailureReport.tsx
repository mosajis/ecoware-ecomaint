import CustomizedDataGrid from "@/shared/components/dataGrid/DataGrid";
import { useCallback } from "react";
import { useDataGrid } from "@/shared/hooks/useDataGrid";
import { tblFailureReports, TypeTblMaintLog } from "@/core/api/generated/api";
import {
  columns,
  getRowId,
} from "@/pages/report/failureReport/FailureReportColumns";

interface Props {
  selected: TypeTblMaintLog;
  label?: string | null;
}

const TabFailureReport = ({ selected, label }: Props) => {
  const getAll = useCallback(() => {
    return tblFailureReports.getAll({
      filter: {
        maintLogId: selected.maintLogId,
      },
      include: {
        tblMaintLog: {
          include: {
            tblUsersTblMaintLogReportedByTotblUsers: {
              include: { tblEmployeeTblUsersEmployeeIdTotblEmployee: true },
            },
            tblComponentUnit: true,
            tblMaintCause: true,
            tblDiscipline: true,
          },
        },
        tblFailureSeverityLevel: true,
        tblFailureStatus: true,
        tblFailureGroupFollow: true,
        tblUsers: {
          include: { tblEmployeeTblUsersEmployeeIdTotblEmployee: true },
        },
      },
    });
  }, [selected?.maintLogId]);

  const { rows, loading, handleRefresh } = useDataGrid(
    getAll,
    tblFailureReports.getById,
    "failureReportId",
    !!selected?.maintLogId,
  );

  return (
    <CustomizedDataGrid
      showToolbar
      disableRowNumber
      disableAdd
      disableEdit
      disableDelete
      disableRowSelectionOnClick
      label={label ?? "Failure Report"}
      rows={rows}
      columns={columns}
      loading={loading}
      onRefreshClick={handleRefresh}
      getRowId={getRowId}
    />
  );
};

export default TabFailureReport;
