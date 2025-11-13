import CustomizedDataGrid from "@/shared/components/dataGrid/DataGrid";

const rows = [
  { id: 1, Description: "در انتظار تأیید", OrderNo: 1001 },
  { id: 2, Description: "در حال انجام", OrderNo: 1002 },
  { id: 4, Description: "لغو شده", OrderNo: 1004 },
];

const columns = [
  { field: "Description", headerName: "Description", flex: 1 },
  { field: "OrderNo", headerName: "OrderNo", flex: 1 },
];

export default function JobClassPage() {
  return <CustomizedDataGrid rows={rows} columns={columns} label="Job Class" />;
}
