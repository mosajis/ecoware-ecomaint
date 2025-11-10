import TabsComponent from "./ComponentUnitTabs";
import CustomizedDataGrid from "@/shared/components/DataGrid";
import { tblComponentUnit } from "@/core/api/generated/api";
import { type GridColDef } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { useColorScheme } from "@mui/material/styles";
import Splitter from "@/shared/components/Splitter";

interface ComponentData {
  id: number;
  compId: number;
  compTypeId: number | null;
  model: string;
  serialNo: string;
  comment1: string;
  statusId: string | number;
}

const ComponentUnitListView = () => {
  const [tableData, setTableData] = useState<ComponentData[]>([]);
  const [loading, setLoading] = useState(true);
  const { mode, systemMode, setMode } = useColorScheme();

  const columns: GridColDef[] = [
    { field: "compId", headerName: "Comp Name", flex: 1 },
    { field: "compTypeId", headerName: "Comp Type", flex: 1 },
    { field: "model", headerName: "Model", flex: 1 },
    { field: "serialNo", headerName: "Serial No", flex: 1 },
    { field: "comment1", headerName: "Comment 1", flex: 1 },
    { field: "statusId", headerName: "Status", flex: 1 },
  ];

  useEffect(() => {
    setLoading(true);
    tblComponentUnit.getAll().then((data) => {
      const formattedData: ComponentData[] = data.items.map((item) => ({
        id: item.compId,
        compId: item.compId,
        compTypeId: item.compTypeId,
        model: "N/A",
        serialNo: item.serialNo || "N/A",
        comment1: "N/A",
        statusId: item.statusId || "N/A",
      }));
      setTableData(formattedData);
      setLoading(false);
    });
  }, []);

  return (
    <Splitter horizontal>
      <TabsComponent />
      <CustomizedDataGrid
        label="Component Unit"
        rows={tableData}
        columns={columns}
        loading={loading}
        checkboxSelection
        disableMultipleRowSelection
        style={{ height: "100%" }}
      />
    </Splitter>
  );
};

export default ComponentUnitListView;
