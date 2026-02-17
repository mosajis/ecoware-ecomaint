import TabContainer from "@/shared/components/TabContainer";
import DataGrid from "@/shared/components/dataGrid/DataGrid";
import LinearProgress from "@mui/material/LinearProgress";
import { memo, useCallback, useEffect, useState } from "react";
import { attachmentColumns } from "../AttachmentColumn";
import { GridRowId, GridRowSelectionModel } from "@mui/x-data-grid";
import { useDataGrid } from "@/shared/hooks/useDataGrid";
import { tblAttachment, TypeTblAttachment } from "@/core/api/generated/api";

const getRowId = (row: TypeTblAttachment) => row.attachmentId;

interface Props {
  onSelectionChange: (id: number | null) => void;
}

function TabAttachmentExisting({ onSelectionChange }: Props) {
  const [rowSelectionModel, setRowSelectionModel] =
    useState<GridRowSelectionModel>({
      type: "include",
      ids: new Set<GridRowId>([]),
    });

  const getAll = useCallback(() => {
    return tblAttachment.getAll({
      include: {
        tblAttachmentType: true,
      },
    });
  }, []);

  const { loading, rows } = useDataGrid(
    getAll,
    tblAttachment.deleteById,
    "attachmentId",
  );

  useEffect(() => {
    const firstItem = Array.from(rowSelectionModel.ids)[0];
    if (firstItem) {
      onSelectionChange(Number(firstItem));
      return;
    }
    onSelectionChange(null);
  }, [rowSelectionModel.ids]);

  return (
    <TabContainer>
      {loading && <LinearProgress />}
      <DataGrid
        disableRowNumber
        disableAdd
        disableRefresh
        disableMultipleRowSelection
        label="Attachments"
        rows={rows}
        columns={attachmentColumns}
        rowSelectionModel={rowSelectionModel}
        onRowSelectionModelChange={setRowSelectionModel}
        getRowId={getRowId}
      />
    </TabContainer>
  );
}

export default memo(TabAttachmentExisting);
