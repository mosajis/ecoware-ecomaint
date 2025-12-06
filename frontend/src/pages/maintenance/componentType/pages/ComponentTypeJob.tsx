import CustomizedDataGrid from "@/shared/components/dataGrid/DataGrid";
import Splitter from "@/shared/components/Splitter";
import TabsContainer from "@/shared/components/TabsContainer";
import ComponentTypeJobTabs from "./ComponentTypeJobTabs";
import ComponentTypeJobFormDialog from "./ComponentTypeJobFormDialog";
import { useCallback, useEffect, useState } from "react";
import { GridColDef } from "@mui/x-data-grid";
import {
  tblCompType,
  tblCompTypeJob,
  tblJobDescription,
  TypeTblCompTypeJob,
} from "@/core/api/generated/api";
import { useDataGrid } from "@/pages/general/_hooks/useDataGrid";
import { useMatch, useParams } from "@tanstack/react-router";
import { maintComponentTypeDetailRoute } from "@/app/routes";
import { dataGridActionColumn } from "@/shared/components/dataGrid/DataGridActionsColumn";
import { Cancel, Check, CheckCircle } from "@mui/icons-material";
import { StatusIcon } from "../utils/StatusIcon";
import { logicTblCompTypeJob } from "./ComponentTypeJob.logic";

export default function ComponentTypeJob() {
  const { id } = useParams({ from: maintComponentTypeDetailRoute.id });
  const compTypeId = Number(id);

  const match = useMatch({ from: maintComponentTypeDetailRoute.id });

  // State
  const [compName, setCompName] = useState<string | null>(null);
  const [selectedCompType, setSelectedCompType] = useState<{
    compTypeId: number;
    compName: string;
  } | null>(null);
  const [openForm, setOpenForm] = useState(false);
  const [mode, setMode] = useState<"create" | "update">("create");
  const [selectedRowId, setSelectedRowId] = useState<number | null>(null);

  // Handlers
  const handleCreate = () => {
    setSelectedRowId(null);
    setMode("create");
    setOpenForm(true);
  };

  const handleEdit = (row: TypeTblCompTypeJob) => {
    setSelectedRowId(row.compTypeJobId);
    setMode("update");
    setOpenForm(true);
  };

  // Fetch Component Type info
  const fetchCompType = useCallback(async () => {
    if (!compTypeId) return;
    try {
      const res = await tblCompType.getById(compTypeId);
      setCompName(res.compName || null);
      setSelectedCompType({
        compTypeId: res.compTypeId,
        compName: res.compName || "",
      });
    } catch (error) {
      console.error("Failed to load component type", error);
    }
  }, [compTypeId]);

  useEffect(() => {
    fetchCompType();
  }, [fetchCompType]);

  // DataGrid fetch
  const getAll = useCallback(() => {
    return tblCompTypeJob.getAll({
      include: {
        tblPeriod: true,
        tblJobDescription: true,
        tblDiscipline: true,
        tblMaintClass: true,
        tblMaintType: true,
        tblMaintCause: true,
      },
      filter: { compTypeId },
    });
  }, [compTypeId]);

  const handleDeleteLogic = (row) => {
    console.log(row);
    // handleDelete(row);
    // logicTblCompTypeJob.effect(row.compTypeJobId, 2);
  };

  const { rows, loading, handleRefresh, handleDelete } = useDataGrid(
    getAll,
    tblCompTypeJob.deleteById,
    "compTypeJobId"
  );
  const columns: GridColDef<TypeTblCompTypeJob>[] = [
    {
      field: "jobCode",
      headerName: "Code",
      width: 90,
      valueGetter: (v, row) => row?.tblJobDescription?.jobDescCode,
    },
    {
      field: "jobName",
      headerName: "Title",
      flex: 2.5,
      valueGetter: (v, row) => row?.tblJobDescription?.jobDescTitle,
    },
    {
      field: "frequency",
      headerName: "Frequency",
      flex: 1,
    },
    {
      field: "frequencyPeriod",
      headerName: "Period",
      flex: 1,
      valueGetter: (v, row) => row?.tblPeriod?.name,
    },
    {
      field: "discipline",
      headerName: "Discipline",
      flex: 1,
      valueGetter: (_, row) => row.tblDiscipline?.name,
    },
    {
      field: "maintClass",
      headerName: "Mt-Class",
      flex: 1,
      valueGetter: (_, row) => row.tblMaintClass?.descr,
    },
    {
      field: "maintType",
      headerName: "Mt-Type",
      flex: 1,
      valueGetter: (_, row) => row.tblMaintType?.descr,
    },
    {
      field: "maintCause",
      headerName: "Mt-Cause",
      flex: 1,
      valueGetter: (_, row) => row.tblMaintCause?.descr,
    },

    {
      field: "priority",
      headerName: "Priority",
      flex: 1,
      valueGetter: (_, row) => row.priority,
    },
    {
      field: "window",
      headerName: "Window",
      flex: 1,
    },
    {
      field: "planningMethod",
      headerName: "Method",
      flex: 1,
      valueGetter: (_, row) => (row.planningMethod ? "Fixed" : "Vairable"),
    },
    {
      field: "statusNone",
      headerName: "St-None",
      flex: 1,
      renderCell: ({ row }) => <StatusIcon status={row.statusNone} />,
    },
    {
      field: "statusInUse",
      headerName: "St-InUse",
      flex: 1,
      renderCell: ({ row }) => <StatusIcon status={row.statusInUse} />,
    },
    {
      field: "statusAvailable",
      headerName: "St-Available",
      flex: 1,
      renderCell: ({ row }) => <StatusIcon status={row.statusAvailable} />,
    },
    {
      field: "statusRepair",
      headerName: "St-Repair",
      flex: 1,
      renderCell: ({ row }) => <StatusIcon status={row.statusRepair} />,
    },

    dataGridActionColumn({
      onEdit: handleEdit,
      onDelete: handleDeleteLogic,
    }),
  ];

  return (
    <>
      <Splitter horizontal>
        <CustomizedDataGrid
          rows={rows}
          columns={columns}
          loading={loading}
          onAddClick={handleCreate}
          onRowDoubleClick={handleEdit}
          label="Component Type Job"
          showToolbar
          onRefreshClick={handleRefresh}
          getRowId={(row) => row.compTypeJobId}
        />
        <ComponentTypeJobTabs />
      </Splitter>

      {selectedCompType && (
        <ComponentTypeJobFormDialog
          open={openForm}
          mode={mode}
          recordId={selectedRowId}
          compType={selectedCompType}
          onClose={() => setOpenForm(false)}
          onSuccess={handleRefresh}
        />
      )}
    </>
  );
}
