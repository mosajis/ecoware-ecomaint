import AttachmentMapUpsert from "./AttachmentMapUpsert";
import DataGrid from "@/shared/components/dataGrid/DataGrid";
import { memo, useCallback, useMemo, useState } from "react";
import { useDataGrid } from "@/shared/hooks/useDataGrid";
import { BaseAttachmentGridProps, MapRelationConfig } from "./AttachmentType";
import { attachmentTableColumns } from "./AttachmentColumn";

export type AttachmentMapProps<T = any> = BaseAttachmentGridProps<T> & {
  onAfterAdd?: (id: number) => void;
  onAskDelete?: (id: number, deleteFn: () => Promise<void>) => void;
  refreshTrigger?: number;
};

function AttachmentMap<T = any>({
  disableAdd,
  disableDelete,
  filterId,
  filterKey,
  relName,
  tableId,
  label = "Attachments",
  mapService,
  onAfterAdd,
  onAskDelete,
  refreshTrigger,
}: AttachmentMapProps<T>) {
  const [openForm, setOpenForm] = useState(false);

  const getAll = useCallback(() => {
    return mapService.getAll({
      filter: {
        [filterKey]: filterId,
      },
      include: {
        tblAttachment: {
          include: {
            tblAttachmentType: true,
          },
        },
      },
    });
  }, [filterId, filterKey, mapService]);

  const { rows, loading, handleRefresh } = useDataGrid(
    getAll,
    undefined as any,
    tableId as any,
    !!filterId,
  );

  // Refresh when trigger changes
  useMemo(() => {
    if (refreshTrigger !== undefined) {
      handleRefresh();
    }
  }, [refreshTrigger, handleRefresh]);

  const openUpsert = useCallback(() => {
    setOpenForm(true);
  }, []);

  const closeUpsert = useCallback(() => {
    setOpenForm(false);
  }, []);

  const handleAddSuccess = useCallback(
    (data: any) => {
      const id = data[tableId];

      if (onAfterAdd) {
        // اگر callback وجود داشت، فقط callback را صدا بزن
        onAfterAdd(id);
      } else {
        // اگر callback نبود، مستقیم refresh کن
        handleRefresh();
      }
      closeUpsert();
    },
    [tableId, onAfterAdd, handleRefresh, closeUpsert],
  );

  const handleDeleteClick = useCallback(
    async (rowId: number) => {
      const deleteFn = async () => {
        await mapService.deleteById(rowId);
        handleRefresh();
      };

      if (onAskDelete) {
        // والد مسئول confirm و effect و delete است
        onAskDelete(rowId, deleteFn);
      } else {
        // حالت پیش‌فرض: مستقیم پاک کن
        await deleteFn();
      }
    },
    [onAskDelete, mapService, handleRefresh],
  );

  const relationConfig: MapRelationConfig = useMemo(
    () => ({
      filterId,
      filterKey,
      relName,
      attachmentField: "tblAttachment",
    }),
    [filterKey, filterId, relName],
  );

  const getRowId = useCallback((row: any) => row[tableId], [tableId]);

  return (
    <>
      <DataGrid
        disableAdd={disableAdd}
        disableDelete={disableDelete}
        disableRowNumber
        disableEdit
        label={label}
        showToolbar={!!filterId}
        rows={rows}
        columns={attachmentTableColumns}
        loading={loading}
        onDeleteClick={handleDeleteClick}
        onAddClick={openUpsert}
        onRefreshClick={handleRefresh}
        getRowId={getRowId}
      />

      <AttachmentMapUpsert<T>
        mapService={mapService}
        open={openForm}
        relationConfig={relationConfig}
        onClose={closeUpsert}
        onSuccess={handleAddSuccess}
      />
    </>
  );
}

export default memo(AttachmentMap);
