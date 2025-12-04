import CustomizedDataGrid from "@/shared/components/dataGrid/DataGrid";
import { useCallback, useState } from "react";
import { GridColDef } from "@mui/x-data-grid";
import { tblCompTypeJob, TypeTblCompTypeJob } from "@/core/api/generated/api";
import { useDataGrid } from "@/pages/general/_hooks/useDataGrid";
import Splitter from "@/shared/components/Splitter";
import TabsContainer from "@/shared/components/TabsContainer";
import ComponentTypeJobTabs from "./ComponentTypeJobTabs";
import ComponentTypeJobFormDialog from "./ComponentTypeJobFormDialog";

interface ComponentTypeJobProps {
  componentTypeId: number | null | undefined;
  label?: string | null;
}

const columns: GridColDef<TypeTblCompTypeJob>[] = [
  {
    field: "jobCode",
    headerName: "Code",
    flex: 1,
  },
  {
    field: "jobName",
    headerName: "Title",
    flex: 1,
  },
  {
    field: "frequency",
    headerName: "Frequency",
    flex: 1,
  },
  {
    field: "frequencyPeriod",
    headerName: "Frequency Period",
    flex: 1,
  },
  {
    field: "discipline",
    headerName: "Discipline",
    flex: 1,
    valueGetter: (_, row) => row.tblDiscipline?.disciplineName,
  },
  {
    field: "maintType",
    headerName: "Maint Type",
    flex: 1,
    valueGetter: (_, row) => row.tblMaintType?.maintTypeName,
  },
  {
    field: "maintCause",
    headerName: "Maint Cause",
    flex: 1,
    valueGetter: (_, row) => row.tblMaintCause?.maintCauseName,
  },
  {
    field: "priority",
    headerName: "Priority",
    flex: 1,
    valueGetter: (_, row) => row.tblPriority?.priorityName,
  },
  {
    field: "window",
    headerName: "Window",
    flex: 1,
  },
  {
    field: "planningMethod",
    headerName: "Planning Method",
    flex: 1,
  },
  {
    field: "statusNone",
    headerName: "StatusNone",
    flex: 1,
  },
  {
    field: "statusInUse",
    headerName: "StatusInUse",
    flex: 1,
  },
  {
    field: "statusAvailable",
    headerName: "StatusAvailable",
    flex: 1,
  },
  {
    field: "statusRepair",
    headerName: "StatusRepair",
    flex: 1,
  },
];

export default function ComponentTypeJob() {
  const [openForm, setOpenForm] = useState(false);
  const [mode, setMode] = useState<"create" | "update">("create");
  const [selectedRowId, setSelectedRowId] = useState<number | null>(null);

  const handleCreate = () => {
    setSelectedRowId(null);
    setMode("create");
    setOpenForm(true);
  };

  const handleEdit = (row: any) => {
    setSelectedRowId(row.locationId);
    setMode("update");
    setOpenForm(true);
  };

  const getAll = useCallback(() => {
    return tblCompTypeJob.getAll({
      include: {
        tblDiscipline: true,
        tblMaintType: true,
        tblMaintCause: true,
        tblPriority: true,
      },
    });
  }, []);

  const { rows, loading, handleRefresh } = useDataGrid(
    getAll,
    tblCompTypeJob.deleteById,
    "componentTypeJobId"
  );

  return (
    <>
      <Splitter horizontal>
        <CustomizedDataGrid
          rows={rows}
          columns={columns}
          loading={loading}
          onAddClick={handleCreate}
          label={"Component Type Job"}
          showToolbar
          onRefreshClick={handleRefresh}
          getRowId={(row) => row.componentTypeJobId}
        />
        <ComponentTypeJobTabs />
      </Splitter>
      <ComponentTypeJobFormDialog
        open={openForm}
        mode={mode}
        recordId={selectedRowId}
        onClose={() => setOpenForm(false)}
        onSuccess={() => {}}
      />
    </>
  );
}
