import CustomizedDataGrid from "@/shared/components/dataGrid/DataGrid";

const TabLogCounter = () => {
  const columns = [
    { field: "resourceName", headerName: "Log Counter", flex: 1 },
    { field: "discipline", headerName: "Log Counter", flex: 1 },
    { field: "timeSpent", headerName: "Log Counter", flex: 1 },
  ];

  return (
    <CustomizedDataGrid label="Resource Used" rows={[]} columns={columns} />
  );
};

export default TabLogCounter;
