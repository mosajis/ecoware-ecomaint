import CustomizedDataGrid from "@/shared/components/dataGrid/DataGrid";
import TabComponentUpsert from "./TabComponentUnitUpsert";
import { useState, useCallback } from "react";
import { useDataGrid } from "@/shared/hooks/useDataGrid";
import { columns, getRowId } from "./TabComponentUnitColumns";
import { tblWorkShopComponent } from "@/core/api/generated/api";

type Props = {
  workShopId?: number | null;
  label?: string;
};

export default function TabComponents({ workShopId, label }: Props) {
  const [openForm, setOpenForm] = useState(false);

  const handleCreate = () => {
    if (!workShopId) return;

    setOpenForm(true);
  };

  const getAll = useCallback(() => {
    return tblWorkShopComponent.getAll({
      filter: { workShopId },
      include: {
        tblComponentUnit: {
          include: {
            tblCompType: true,
          },
        },
        tblLocation: true,
      },
    });
  }, [workShopId]);

  const { rows, loading, handleRefresh, handleDelete } = useDataGrid(
    getAll,
    tblWorkShopComponent.deleteById,
    "workShopCompId",
    !!workShopId,
  );

  const handleFormSuccess = () => {
    setOpenForm(false);
    handleRefresh();
  };

  return (
    <>
      <CustomizedDataGrid
        showToolbar={!!workShopId}
        disableEdit={true}
        label={label}
        loading={loading}
        rows={rows}
        columns={columns}
        getRowId={getRowId}
        onDeleteClick={handleDelete}
        onRefreshClick={handleRefresh}
        onAddClick={handleCreate}
      />

      {workShopId && (
        <TabComponentUpsert
          open={openForm}
          workShopId={workShopId}
          onClose={() => setOpenForm(false)}
          onSuccess={handleFormSuccess}
        />
      )}
    </>
  );
}
