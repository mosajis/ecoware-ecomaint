import CustomizedDataGrid from "@/shared/components/dataGrid/DataGrid";
import { useCallback } from "react";
import { useDataGrid } from "@/shared/hooks/useDataGrid";
import {
  columns,
  getRowId,
} from "@/pages/report/reportFailure/ReportFailureColumns";
import {
  tblFailureReports,
  TypeTblComponentUnit,
} from "@/core/api/generated/api";

interface TabFailureReportProps {
  componentUnit?: TypeTblComponentUnit | null;
  label?: string;
}

const TabFailureReport = ({ componentUnit, label }: TabFailureReportProps) => {
  const compId = componentUnit?.compId;

  const getAll = useCallback(() => {
    return tblFailureReports.getAll({
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
      filter: {
        tblMaintLog: {
          compId,
        },
      },
    });
  }, [compId]);

  const { rows, loading, handleRefresh } = useDataGrid(
    getAll,
    tblFailureReports.getById,
    "failureReportId",
    !!compId,
  );

  return (
    <CustomizedDataGrid
      disableAdd
      disableEdit
      disableDelete
      label={label}
      showToolbar={!!label}
      rows={rows}
      columns={columns}
      loading={loading}
      onRefreshClick={handleRefresh}
      getRowId={getRowId}
    />
  );
};

export default TabFailureReport;
