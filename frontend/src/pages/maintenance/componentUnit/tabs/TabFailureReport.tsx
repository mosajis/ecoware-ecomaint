import CustomizedDataGrid from "@/shared/components/dataGrid/DataGrid";
import FailureReportUpsert from "@/pages/report/failureReport/FailureReportUpsert";
import Splitter from "@/shared/components/Splitter/Splitter";
import AttachmentMap from "@/shared/tabs/attachmentMap/AttachmentMap";
import { useCallback, useState } from "react";
import { useDataGrid } from "@/shared/hooks/useDataGrid";
import {
  columns,
  getRowId,
} from "@/pages/report/failureReport/FailureReportColumns";
import {
  tblFailureReport,
  tblMaintLogAttachment,
  TypeTblComponentUnit,
  TypeTblFailureReport,
} from "@/core/api/generated/api";

interface TabFailureReportProps {
  componentUnit?: TypeTblComponentUnit | null;
  label?: string;
}

const TabFailureReport = ({ componentUnit, label }: TabFailureReportProps) => {
  const compId = componentUnit?.compId;

  const [selectedRow, setSelectedRow] = useState<TypeTblFailureReport | null>(
    null,
  );
  const [dialogs, setDialogs] = useState({
    upsert: false,
  });

  const handleRowClick = useCallback(
    ({ row }: { row: TypeTblFailureReport }) => {
      if (row.failureReportId === selectedRow?.failureReportId) {
        setSelectedRow(null);
        return;
      }
      setSelectedRow(row);
    },
    [selectedRow],
  );

  const openDialog = (key: keyof typeof dialogs) =>
    setDialogs((p) => ({ ...p, [key]: true }));

  const closeDialog = (key: keyof typeof dialogs) =>
    setDialogs((p) => ({ ...p, [key]: false }));

  const getAll = useCallback(() => {
    return tblFailureReport.getAll({
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
    tblFailureReport.getById,
    "failureReportId",
    !!compId,
  );

  const handleSucessUpsert = () => {
    closeDialog("upsert");
    handleRefresh();
  };

  const handleDoubleClick = (rowId: number) => {
    setSelectedRow({ ...selectedRow, failureReportId: rowId } as any);
    openDialog("upsert");
  };
  return (
    <>
      <Splitter horizontal>
        <CustomizedDataGrid
          disableAdd
          disableEdit
          disableDelete
          label={label}
          showToolbar={!!label}
          rows={rows}
          columns={columns}
          loading={loading}
          onDoubleClick={handleDoubleClick}
          onRowClick={handleRowClick}
          onRefreshClick={handleRefresh}
          getRowId={getRowId}
        />
        <AttachmentMap
          mapService={tblMaintLogAttachment}
          filterId={selectedRow?.maintLogId}
          label={"Failure Attachments"}
          filterKey="maintLogId"
          relName="tblMaintLog"
          tableId="maintLogAttachmentId"
        />
      </Splitter>
      <FailureReportUpsert
        entityName="Failure Report"
        open={dialogs.upsert}
        mode={"update"}
        recordId={selectedRow?.failureReportId!}
        onClose={() => closeDialog("upsert")}
        onSuccess={handleSucessUpsert}
      />
    </>
  );
};

export default TabFailureReport;
