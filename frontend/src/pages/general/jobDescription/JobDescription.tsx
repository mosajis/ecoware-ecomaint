import Splitter from "@/shared/components/Splitter";
import AppEditor from "@/shared/components/Editor";
import CustomizedDataGrid from "@/shared/components/dataGrid/DataGrid";
import JobDescriptionFormDialog from "./JobDescriptionFormDialog";
import { GridColDef } from "@mui/x-data-grid";
import { useDataGrid } from "../_hooks/useDataGrid";
import { useCallback, useMemo, useState } from "react";
import { dataGridActionColumn } from "@/shared/components/dataGrid/DataGridActionsColumn";
import { JobDescriptionTabs } from "./JobDescriptionTabs";
import {
  tblJobDescription,
  TypeTblJobDescription,
} from "@/core/api/generated/api";

export default function JobDescription() {
  const [html, setHtml] = useState("");
  const [selectedRowId, setSelectedRowId] = useState<null | number>(null);
  const [openForm, setOpenForm] = useState(false);
  const [mode, setMode] = useState<"create" | "update">("create");

  // === DataGrid ===
  const getAll = useCallback(() => {
    return tblJobDescription.getAll({
      paginate: true,
      include: { tblJobClass: true },
    });
  }, []);

  const { rows, loading, fetchData, handleDelete } = useDataGrid(
    getAll,
    tblJobDescription.deleteById,
    "jobDescId"
  );

  // === Handlers ===
  const handleCreate = useCallback(() => {
    setSelectedRowId(null);
    setMode("create");
    setOpenForm(true);
  }, []);

  const handleEdit = useCallback((row: TypeTblJobDescription) => {
    setSelectedRowId(row.jobDescId);
    setMode("update");
    setOpenForm(true);
  }, []);

  // === Columns ===
  const columns: GridColDef<TypeTblJobDescription>[] = useMemo(
    () => [
      { field: "jobDescCode", headerName: "JobDescCode", width: 120 },
      { field: "jobDesc", headerName: "JobDesc", flex: 1 },
      {
        field: "jobClass",
        headerName: "JobClass",
        flex: 1,
        valueGetter: (value, row) => row?.tblJobClass?.name,
      },
      { field: "changeReason", headerName: "ChangeReason", flex: 1 },
      dataGridActionColumn({ onEdit: handleEdit, onDelete: handleDelete }),
    ],
    [handleEdit, handleDelete]
  );

  return (
    <>
      <Splitter
        horizontal
        initialPrimarySize="50%"
        resetOnDoubleClick
        minPrimarySize="20%"
        minSecondarySize="20%"
      >
        <JobDescriptionTabs />
        <Splitter
          horizontal={false}
          initialPrimarySize="65%"
          resetOnDoubleClick
          minPrimarySize="30%"
          minSecondarySize="25%"
        >
          <CustomizedDataGrid
            label="Job Description"
            getRowId={(row) => row.jobDescId}
            loading={loading}
            onAddClick={handleCreate}
            rows={rows}
            columns={columns}
            showToolbar
          />

          <AppEditor value={html} onChange={(e) => setHtml(e.target.value)} />
        </Splitter>
      </Splitter>

      <JobDescriptionFormDialog
        open={openForm}
        mode={mode}
        recordId={selectedRowId}
        onClose={() => setOpenForm(false)}
        onSuccess={() => {
          fetchData();
          setOpenForm(false);
        }}
      />
    </>
  );
}
