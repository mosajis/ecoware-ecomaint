import CustomizedDataGrid from "@/shared/components/dataGrid/DataGrid";

const TabPart = () => {
  const columns = [
    { field: "partName", headerName: "Part Name", flex: 1 },
    { field: "makerRef", headerName: "Maker Ref", flex: 1 },
    { field: "partNo", headerName: "Part No", flex: 1 },
    { field: "extraNo", headerName: "Extra No", flex: 1 },
    { field: "notesDescription", headerName: "Notes Description", flex: 1 },
    { field: "farsiDescription", headerName: "Farsi Description", flex: 1 },
  ];

  const rows: any = [];

  return <CustomizedDataGrid label="Parts" rows={rows} columns={columns} />;
};

export default TabPart;
