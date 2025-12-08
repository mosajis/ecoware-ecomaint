import CustomizedDataGrid from "@/shared/components/dataGrid/DataGrid"; // مسیرت رو درست کن

const TabOilInfo = () => {
  const columns = [
    { field: "compNo", headerName: "Comp No", flex: 1 },
    { field: "typeName", headerName: "Type Name", flex: 1 },
    { field: "jobDescCode", headerName: "Job Desc Code", flex: 1 },
    { field: "jobDescTitle", headerName: "Job Desc Title", flex: 1 },
    { field: "partName", headerName: "Part Name", flex: 1 },
    { field: "counterTypeName", headerName: "Counter Type Name", flex: 1 },
    { field: "loggedBy", headerName: "Logged By", flex: 1 },
    { field: "tankCapacity", headerName: "Tank Capacity", flex: 1 },
    { field: "laboratoryCode", headerName: "Laboratory Code", flex: 1 },
    { field: "samplingPosition", headerName: "Sampling Position", flex: 1 },
    { field: "oilGrade", headerName: "Oil Grade", flex: 1 },
  ];

  return <CustomizedDataGrid label="Oil Info" rows={[]} columns={columns} />;
};

export default TabOilInfo;
