import CustomizedDataGrid from "@/shared/components/dataGrid/DataGrid";

export default function Discipline() {
  // جدول 2: لیست Discipline ها
  const disciplineColumns = [{ field: "name", headerName: "Name", width: 200 }];
  const disciplineRows = [
    { id: 1, name: "Warning" },
    { id: 2, name: "Suspension" },
    { id: 3, name: "Termination" },
  ];

  return (
    <CustomizedDataGrid
      label="Discipline "
      showToolbar
      rows={disciplineRows}
      columns={disciplineColumns}
      onAddClick={() => console.log("Add discipline")}
      onRefreshClick={() => console.log("Refresh discipline list")}
    />
  );
}
