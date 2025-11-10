import { jsx as _jsx } from "react/jsx-runtime";
import { Box } from "@mui/material";
import CustomizedDataGrid from "@/shared/components/DataGrid"; // مسیرت رو درست کن
const TabStockUsed = () => {
    const columns = [
        { field: "mescCode", headerName: "MESC Code", flex: 1 },
        { field: "extraNo", headerName: "Extra No", flex: 1 },
        { field: "partName", headerName: "Part Name", flex: 1 },
        { field: "qyt", headerName: "QYT", flex: 1 },
        { field: "unitName", headerName: "Unit Name", flex: 1 },
        { field: "totalMainLogs", headerName: "Total Main Logs", flex: 1 },
    ];
    const rows = [
        {
            id: "1",
            mescCode: "M001",
            extraNo: "E001",
            partName: "Bolt A",
            qyt: 50,
            unitName: "Pieces",
            totalMainLogs: 10,
        },
    ];
    return (_jsx(Box, { display: "flex", flexDirection: "column", height: "100%", children: _jsx(CustomizedDataGrid, { style: { flex: 1 }, label: "Stock Used", rows: rows, columns: columns }) }));
};
export default TabStockUsed;
