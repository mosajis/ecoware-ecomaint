import CellFileSize from "@/shared/components/dataGrid/cells/CellFileSize";
import CellDownload from "@/shared/components/dataGrid/cells/CellDownload";
import { GridColDef } from "@mui/x-data-grid";
import CellDateTime from "@/shared/components/dataGrid/cells/CellDateTime";
import CellFullName from "@/shared/components/dataGrid/cells/CellFullName";

export const attachmentColumns: GridColDef[] = [
  { field: "title", headerName: "Title", flex: 1 },
  {
    field: "attachmentType",
    headerName: "Type",
    width: 150,
    valueGetter: (_, row) => row?.tblAttachmentType?.name ?? "",
  },
];

export const attachmentTableColumns: GridColDef[] = [
  {
    field: "Link",
    headerName: "Link",
    width: 55,
    renderCell: ({ row }) => (
      <CellDownload attachmentId={row?.tblAttachment?.attachmentId} />
    ),
  },
  {
    field: "title",
    headerName: "Title",
    flex: 1,
    valueGetter: (_, row) => row?.tblAttachment?.title,
  },
  {
    field: "attachmentType",
    headerName: "Attachment Type",
    width: 200,
    valueGetter: (_, row) => row?.tblAttachment?.tblAttachmentType?.name,
  },
  {
    field: "size",
    headerName: "Size",
    width: 100,
    renderCell: ({ row }) => <CellFileSize value={row.tblAttachment?.size} />,
  },
  {
    field: "isUserAttachment",
    headerName: "User Attachment",
    type: "boolean",
    valueGetter: (_, row) => row?.tblAttachment?.isUserAttachment,
    width: 135,
  },
  {
    field: "employee",
    headerName: "Employee",

    valueGetter: (_, row) => row?.tblAttachment?.tblEmployee,
    renderCell: ({ value }) => <CellFullName value={value} />,
  },
  {
    field: "createdAt",
    headerName: "Created At",
    width: 150,
    valueGetter: (_, row) => row?.tblAttachment?.createdAt,
    renderCell: ({ value }) => <CellDateTime value={value} />,
  },
];
