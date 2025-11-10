import { jsx as _jsx } from "react/jsx-runtime";
import { Box, CircularProgress } from "@mui/material";
const Spinner = ({ height = "100%", color = "inherit", }) => {
    return (_jsx(Box, { sx: {
            height,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
        }, children: _jsx(CircularProgress, { color: color }) }));
};
export default Spinner;
