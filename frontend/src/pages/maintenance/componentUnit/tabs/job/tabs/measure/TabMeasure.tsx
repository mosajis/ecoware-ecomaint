import CustomizedDataGrid from "@/shared/components/dataGrid/DataGrid";
import JobMeasureUpsert from "./TabMeasureUpsert";
import { useCallback, useState } from "react";
import { GridColDef } from "@mui/x-data-grid";
import { useDataGrid } from "@/shared/hooks/useDataGrid";
import {
  tblCompJobMeasurePoint,
  TypeTblCompJob,
  TypeTblCompJobMeasurePoint,
} from "@/core/api/generated/api";
import { columns, getRowId } from "./TabMeasureColumns";

type Props = {
  compJob?: TypeTblCompJob;
};

const TabMeasuresPage = ({ compJob }: Props) => {
  const [openForm, setOpenForm] = useState(false);
  const [mode, setMode] = useState<"create" | "update">("create");
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const label = compJob?.tblJobDescription?.jobDescTitle || "";

  const compJobId = compJob?.compJobId;
  const compId = compJob?.compId;

  // === getAll callback ===
  const getAll = useCallback(() => {
    return tblCompJobMeasurePoint.getAll({
      include: {
        tblCompMeasurePoint: {
          include: {
            tblUnit: true,
            tblCounterType: true,
          },
        },
      },
      filter: {
        compJobId,
      },
    });
  }, [compJobId]);

  // === useDataGrid ===
  const { rows, loading, handleRefresh, handleDelete } = useDataGrid(
    getAll,
    tblCompJobMeasurePoint.deleteById,
    "compJobMeasurePointId",
    !!compJobId,
  );

  // === Handlers ===
  const handleCreate = () => {
    setSelectedId(null);
    setMode("create");
    handleUpsertOpen();
  };

  const handleEdit = (rowId: number) => {
    setSelectedId(rowId);
    setMode("update");
    handleUpsertOpen();
  };

  const handleUpsertClose = useCallback(() => {
    setOpenForm(false);
  }, []);

  const handleUpsertOpen = useCallback(() => {
    setOpenForm(true);
  }, []);
  return (
    <>
      <CustomizedDataGrid
        label={label}
        showToolbar={!!label}
        rows={rows}
        columns={columns}
        loading={loading}
        onRefreshClick={handleRefresh}
        getRowId={getRowId}
        onAddClick={handleCreate}
        onEditClick={handleEdit}
        onDeleteClick={handleDelete}
        onDoubleClick={handleEdit}
      />

      <JobMeasureUpsert
        open={openForm}
        mode={mode}
        recordId={selectedId}
        compJobId={compJobId!}
        compId={compId!}
        onClose={handleUpsertClose}
        onSuccess={handleRefresh}
      />
    </>
  );
};

export default TabMeasuresPage;
