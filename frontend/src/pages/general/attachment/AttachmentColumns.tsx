import CellDateTime from "@/shared/components/dataGrid/cells/CellDateTime";
import CellDownload from "@/shared/components/dataGrid/cells/CellDownload";
import CellFileSize from "@/shared/components/dataGrid/cells/CellFileSize";
import { TypeTblAttachment } from "@/core/api/generated/api";
import { GridColDef } from "@mui/x-data-grid";

export const getRowId = (row: TypeTblAttachment) => row.attachmentId;

// === Columns ===
export const columns: GridColDef<TypeTblAttachment>[] = [
  {
    field: "Link",
    headerName: "Link",
    width: 55,
    renderCell: ({ row }) => <CellDownload attachmentId={row.attachmentId} />,
  },
  { field: "title", headerName: "Title", flex: 1 },
  { field: "fileName", headerName: "File Name", flex: 1 },
  {
    field: "attachmentType",
    headerName: "Attachment Type",
    width: 200,
    valueGetter: (_, row) => row?.tblAttachmentType?.name,
  },
  {
    field: "size",
    headerName: "Size",
    width: 100,
    renderCell: ({ value }) => <CellFileSize value={value} />,
  },
  {
    field: "isUserAttachment",
    headerName: "User Attachment",
    type: "boolean",
    width: 135,
  },
  {
    field: "createdAt",
    headerName: "Created At",
    width: 150,
    renderCell: ({ value }) => <CellDateTime value={value} />,
  },
];
