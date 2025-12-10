import Splitter from "@/shared/components/Splitter";
import Editor from "@/shared/components/Editor";
import CustomizedDataGrid from "@/shared/components/dataGrid/DataGrid";
import { dataGridActionColumn } from "@/shared/components/dataGrid/DataGridActionsColumn";
import { useState, useCallback, useMemo } from "react";
import { useDataGrid } from "@/shared/hooks/useDataGrid";
import {
  tblCompJob,
  tblJobDescription,
  type TypeTblCompJob,
} from "@/core/api/generated/api";
import {
  GridRowSelectionCheckboxParams,
  type GridColDef,
} from "@mui/x-data-grid";

export default function PageComponentJob() {
  const [openForm, setOpenForm] = useState(false);
  const [mode, setMode] = useState<"create" | "update">("create");
  const [selected, setSelected] = useState<TypeTblCompJob | null>(null);
  const [html, setHtml] = useState("");

  const getAll = useCallback(() => {
    return tblCompJob.getAll({
      include: {
        tblComponentUnit: {
          include: {
            tblCompType: true,
          },
        },
        tblJobDescription: true,
        tblPeriod: true,
        tblDiscipline: true,
      },
    });
  }, []);

  const { rows, loading, handleRefresh, handleDelete } = useDataGrid(
    getAll,
    tblCompJob.deleteById,
    "compJobId"
  );

  // === CREATE ===
  const handleCreate = useCallback(() => {
    setSelected(null);
    setMode("create");
    setHtml("");
    setOpenForm(true);
  }, []);

  // === EDIT ===
  const handleEdit = useCallback((row: TypeTblCompJob) => {
    setSelected(row);
    setMode("update");
    setOpenForm(true);
  }, []);

  // === SAVE DESCRIPTION ===
  const handleSaveDescription = async (newValue: string) => {
    if (!selected) return;
    if (!selected.jobDescId) return;

    await tblJobDescription.update(selected.jobDescId, {
      jobDesc: newValue,
    });

    handleRefresh();
  };

  const handleRowClick = (params: any) => {
    setSelected(params.row);
    setHtml(params.row?.tblJobDescription?.jobDesc);
  };

  const columns: GridColDef<TypeTblCompJob>[] = [
    { field: "roundCode", headerName: "Round Code", flex: 1 },
    { field: "roundTitle", headerName: "Round Title", flex: 1 },

    {
      field: "compTypeName",
      headerName: "CompType Name",
      flex: 1,
      // @ts-ignore
      valueGetter: (value, row) => row.tblComponentUnit?.tblCompType.compType,
    },

    {
      field: "compNo",
      headerName: "CompNo",
      flex: 1,
      valueGetter: (value, row) => row.tblComponentUnit?.compNo,
    },

    {
      field: "jobCode",
      headerName: "Job Code",
      flex: 1,
      valueGetter: (value, row) => row.tblJobDescription?.jobDescCode,
    },

    {
      field: "jobTitle",
      headerName: "Job Title",
      flex: 1,
      valueGetter: (value, row) => row.tblJobDescription?.jobDescTitle,
    },

    {
      field: "jobDisiplice",
      headerName: "Job Disiplice",
      flex: 1,
      valueGetter: (value, row) => row.tblDiscipline?.name,
    },

    { field: "frequency", headerName: "Frequency", flex: 1 },

    {
      field: "frequencyPeriod",
      headerName: "Frequency Period",
      flex: 1,
      valueGetter: (value, row) => row.tblPeriod?.name,
    },

    { field: "lastDone", headerName: "Last Done", flex: 1 },
    { field: "nextDueDate", headerName: "NextDueDate", flex: 1 },

    { field: "realOverDue", headerName: "RealOverDue", flex: 1 },
    { field: "lastTimeDone", headerName: "LastTimeDone", flex: 1 },

    dataGridActionColumn({ onEdit: handleEdit, onDelete: handleDelete }),
  ];

  return (
    <>
      <Splitter initialPrimarySize="70%" horizontal>
        <CustomizedDataGrid
          rows={rows}
          loading={loading}
          columns={columns}
          label="Component Job"
          showToolbar
          onAddClick={handleCreate}
          onRefreshClick={handleRefresh}
          getRowId={(row) => row.compJobId}
          onRowClick={handleRowClick}
        />

        <Editor
          key={selected?.compJobId}
          initValue={html}
          onSave={handleSaveDescription}
        />
      </Splitter>
    </>
  );
}
