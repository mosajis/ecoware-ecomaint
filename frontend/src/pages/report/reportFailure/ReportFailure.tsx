import CustomizedDataGrid from "@/shared/components/dataGrid/DataGrid";
import FailureReportUpsert from "./ReportFailureUpsert";
import Splitter from "@/shared/components/Splitter/Splitter";
import AttachmentMap from "@/shared/tabs/attachmentMap/AttachmentMap";
import CellSeverity from "../_components/CellSeverity";
import { GridColDef } from "@mui/x-data-grid";
import { useCallback, useState } from "react";
import { useDataGrid } from "@/shared/hooks/useDataGrid";
import {
  tblFailureReportAttachment,
  tblFailureReports,
  TypeTblFailureReports,
} from "@/core/api/generated/api";
import CellDateTime from "@/shared/components/dataGrid/cells/CellDateTime";

const getRowId = (row: TypeTblFailureReports) => row.failureReportId;

const columns: GridColDef<TypeTblFailureReports>[] = [
  {
    field: "failureNumber",
    headerName: "Number",
    width: 100,
    valueGetter: (_, row) => row.failureNumber,
  },
  {
    field: "componentName",
    headerName: "Component Name",
    flex: 1,
    valueGetter: (_, row) => row?.tblComponentUnit?.compNo,
  },
  {
    field: "failureDateTime",
    headerName: "Failure Date",
    width: 150,
    renderCell: ({ value }) => <CellDateTime value={value} />,
  },
  {
    field: "title",
    headerName: "Title",
    flex: 2,
    valueGetter: (_, row) => row.title,
  },
  {
    field: "totalWait",
    headerName: "Total Wait",
    width: 100,
    valueGetter: (_, row) => row.totalWait,
  },
  {
    field: "severity",
    headerName: "Severity",
    width: 120,
    renderCell: ({ row }) => (
      <CellSeverity value={row.tblFialureSeverityLevel} />
    ),
  },
  {
    field: "groupFollow",
    headerName: "Group Follow",
    width: 130,
    valueGetter: (_, row) => row?.tblFailureGroupFollow?.name,
  },
  {
    field: "discipline",
    headerName: "Discipline",
    width: 120,
    valueGetter: (_, row) => row?.tblDiscipline?.name,
  },
  {
    field: "reportedBy",
    headerName: "Reported By",
    width: 130,
    valueGetter: (_, row) =>
      // @ts-ignore
      row?.tblUsersTblFailureReportsReportedUserIdTotblUsers?.uName,
  },
  {
    field: "approvedBy",
    headerName: "Approved By",
    width: 130,
    valueGetter: (_, row) =>
      // @ts-ignore
      row?.tblUsersTblFailureReportsApprovedUserIdTotblUsers?.userName,
  },
  {
    field: "closedBy",
    headerName: "Closed By",
    width: 130,
    valueGetter: (_, row) =>
      // @ts-ignore
      row?.tblUsersTblFailureReportsClosedUserIdTotblUsers?.userName,
  },
  {
    field: "closedDateTime",
    headerName: "Close Date",
    width: 150,
    renderCell: ({ value }) => <CellDateTime value={value} />,
  },
];

export default function PageReportFailure() {
  const [openForm, setOpenForm] = useState(false);
  const [mode, setMode] = useState<"create" | "update">("create");
  const [selectedRowId, setSelectedRowId] = useState<number | null>(null);
  const [label, setLabel] = useState<string | null>(null);

  const getAll = useCallback(
    () =>
      tblFailureReports.getAll({
        include: {
          tblComponentUnit: true,
          tblDiscipline: true,
          tblFialureSeverityLevel: true,
          tblFailureStatus: true,
          tblFailureGroupFollow: true,
          tblUsersTblFailureReportsReportedUserIdTotblUsers: true,
          tblUsersTblFailureReportsApprovedUserIdTotblUsers: true,
          tblUsersTblFailureReportsClosedUserIdTotblUsers: true,
        },
      }),
    [],
  );

  const { rows, loading, handleRefresh, handleDelete } = useDataGrid(
    getAll,
    tblFailureReports.deleteById,
    "failureReportId",
  );

  // === Handlers ===
  const handleCreate = useCallback(() => {
    setSelectedRowId(null);
    setMode("create");
    handleUpsertOpen();
  }, []);

  const handleEdit = useCallback((rowId: number) => {
    setSelectedRowId(rowId);
    setMode("update");
    handleUpsertOpen();
  }, []);

  const handleUpsertOpen = useCallback(() => {
    setOpenForm(false);
  }, []);

  const handleUpsertClose = useCallback(() => {
    setOpenForm(false);
  }, []);

  const handleRowClick = useCallback(
    ({ row }: { row: TypeTblFailureReports }) => {
      setLabel(row.title);
      setSelectedRowId(row.failureReportId);
    },
    [],
  );

  return (
    <>
      <Splitter horizontal initialPrimarySize="65%">
        <CustomizedDataGrid
          showToolbar
          disableRowNumber
          label="Failure Report"
          loading={loading}
          rows={rows}
          columns={columns}
          onRefreshClick={handleRefresh}
          onAddClick={handleCreate}
          onEditClick={handleEdit}
          onDoubleClick={handleEdit}
          onDeleteClick={handleDelete}
          getRowId={getRowId}
          onRowClick={handleRowClick}
        />
        <AttachmentMap
          label={label || "Failure Attachments"}
          mapService={tblFailureReportAttachment}
          filterId={selectedRowId}
          filterKey="failureReportId"
          relName="tblFailureReports"
          tableId="failureReportAttachmentId"
        />
      </Splitter>

      {/* <FailureReportUpsert
        open={openForm}
        mode={mode}
        recordId={selectedRowId}
        onClose={handleUpsertClose}
        onSuccess={handleRefresh}
      /> */}
    </>
  );
}
