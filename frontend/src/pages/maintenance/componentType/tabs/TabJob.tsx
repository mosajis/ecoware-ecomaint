import CustomizedDataGrid from "@/shared/components/dataGrid/DataGrid";
import { useCallback, useMemo, useState } from "react";
import { tblCompTypeJob, TypeTblCompTypeJob } from "@/core/api/generated/api";
import { useDataGrid } from "@/pages/general/_hooks/useDataGrid";
import { GridColDef } from "@mui/x-data-grid";
import { useNavigate } from "@tanstack/react-router";

type Props = {
  selected?: number | null;
};

const TabJob = ({ selected }: Props) => {
  // ===== Dialog State =====
  const navigate = useNavigate();

  const handleCreate = () => {
    if (!selected) return;
    navigate({
      to: `/maintenance/component-type/${selected}/job`,
    });
  };

  // === getAll callback ===
  const getAll = useCallback(() => {
    if (!selected) return Promise.resolve({ items: [] });
    return tblCompTypeJob.getAll({
      include: {
        tblJobDescription: true,
        tblDiscipline: true,
      },
      filter: {
        compTypeId: selected,
      },
    });
  }, [selected]);

  // === useDataGrid ===
  const { rows, loading, fetchData } = useDataGrid(
    getAll,
    tblCompTypeJob.deleteById,
    "compTypeJobId"
  );

  // === Columns ===
  const columns = useMemo<GridColDef<TypeTblCompTypeJob>[]>(() => {
    return [
      {
        field: "jobCode",
        headerName: "Job Code",
        flex: 1,
        valueGetter: (value, row) => row.tblJobDescription?.jobDescCode || "",
      },
      {
        field: "jobTitle",
        headerName: "Job Title",
        flex: 1,
        valueGetter: (value, row) => row.tblJobDescription?.jobDescTitle || "",
      },
      {
        field: "discipline",
        headerName: "Discipline (set Rel)",
        flex: 1,
        // valueGetter: (value, row) =>  "",
      },
      { field: "frequency", headerName: "Frequency", flex: 1 },
      { field: "frequencyPeriod", headerName: "Frequency Period", flex: 1 },
    ];
  }, []);

  return (
    <>
      <CustomizedDataGrid
        label="Job"
        rows={rows}
        columns={columns}
        loading={loading}
        showToolbar
        getRowId={(row) => row.compTypeJobId}
        onRefreshClick={fetchData}
        onAddClick={handleCreate}
      />
    </>
  );
};

export default TabJob;
