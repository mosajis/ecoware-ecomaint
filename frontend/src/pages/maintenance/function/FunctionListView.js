import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import TabsComponent from "./FunctionTabs";
import CustomizedDataGrid from "@/shared/components/DataGrid";
import { tblComponentUnit } from "@/core/api/generated/api";
import { useEffect, useState } from "react";
import { useColorScheme } from "@mui/material/styles";
import Splitter from "@/shared/components/Splitter";
const ComponentUnitListView = () => {
    const [tableData, setTableData] = useState([]);
    const [loading, setLoading] = useState(true);
    const { mode, systemMode, setMode } = useColorScheme();
    const columns = [
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
            const formattedData = data.items.map((item) => ({
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
    return (_jsxs(Splitter, { horizontal: true, children: [_jsx(TabsComponent, {}), _jsx(CustomizedDataGrid, { label: "Component Unit", rows: tableData, columns: columns, loading: loading, checkboxSelection: true, disableMultipleRowSelection: true, style: { height: "100%" } })] }));
};
export default ComponentUnitListView;
