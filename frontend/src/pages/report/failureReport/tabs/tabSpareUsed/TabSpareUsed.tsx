// TabSpareUsed.tsx
import CustomizedDataGrid from "@/shared/components/dataGrid/DataGrid";
import { useCallback, useState } from "react";
import { useDataGrid } from "@/shared/hooks/useDataGrid";

import {
  tblMaintLogSpare,
  TypeTblFailureReport,
} from "@/core/api/generated/api";

import { columns, getRowId } from "./TabSpareUsedColumns";
import TabSpareUsedUpsert from "./TabSpareUsedUpsert";

type Props = {
  failreReport?: TypeTblFailureReport;
};

const TabSpareUsed = ({ failreReport }: Props) => {
  const maintLogId = failreReport?.maintLogId ?? null;

  const [openForm, setOpenForm] = useState(false);
  const [mode, setMode] = useState<"create" | "update">("create");
  const [selectedRowId, setSelectedRowId] = useState<number | null>(null);

  // CREATE
  const handleCreate = () => {
    setSelectedRowId(null);
    setMode("create");
    setOpenForm(true);
  };

  // GET ALL (safe + stable)
  const getAll = useCallback(() => {
    return tblMaintLogSpare.getAll({
      include: {
        tblSpareUnit: {
          include: {
            tblSpareType: {
              include: {
                tblUnit: true,
              },
            },
          },
        },
      },
      filter: {
        maintLogId,
      },
    });
  }, [maintLogId]);

  const { rows, loading, handleDelete, handleRefresh } = useDataGrid(
    getAll,
    tblMaintLogSpare.deleteById,
    "maintLogSpareId",
    !!maintLogId,
  );

  return (
    <>
      <CustomizedDataGrid
        disableEdit
        showToolbar={!!maintLogId}
        label={failreReport?.title || "Spare Used"}
        rows={rows}
        loading={loading}
        columns={columns}
        getRowId={getRowId}
        onAddClick={handleCreate}
        onDeleteClick={handleDelete}
      />

      {maintLogId && (
        <TabSpareUsedUpsert
          open={openForm}
          mode={mode}
          recordId={selectedRowId}
          maintLogId={maintLogId}
          onClose={() => setOpenForm(false)}
          onSuccess={handleRefresh}
        />
      )}
    </>
  );
};

export default TabSpareUsed;
