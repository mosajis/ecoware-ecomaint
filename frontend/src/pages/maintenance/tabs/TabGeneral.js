import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, Button, Checkbox, FormControlLabel, InputAdornment, TextField, } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import PrintIcon from "@mui/icons-material/Print";
import DownloadIcon from "@mui/icons-material/Download";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
// Icons for fields
import BusinessIcon from "@mui/icons-material/Business";
import CategoryIcon from "@mui/icons-material/Category";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import FactoryIcon from "@mui/icons-material/Factory";
import MemoryIcon from "@mui/icons-material/Memory";
import CommentIcon from "@mui/icons-material/Comment";
import GroupsIcon from "@mui/icons-material/Groups";
import QrCode2Icon from "@mui/icons-material/QrCode2";
import BuildIcon from "@mui/icons-material/Build";
import InfoIcon from "@mui/icons-material/Info";
import BadgeIcon from "@mui/icons-material/Badge";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
const TabGeneral = () => {
    const handleSave = () => {
    };
    return (_jsxs(Box, { display: "flex", height: "100%", flexDirection: "column", justifyContent: "space-between", children: [_jsxs(Box, { display: "grid", gap: 1, gridTemplateColumns: "repeat(3, 1fr)", children: [_jsx(TextField, { label: "Comp. Name", fullWidth: true, 
                        // size="small"
                        InputProps: {
                            startAdornment: (_jsx(InputAdornment, { position: "start", children: _jsx(BusinessIcon, { fontSize: "small" }) })),
                        } }), _jsx(TextField, { label: "Type Name", fullWidth: true, size: "small", InputProps: {
                            startAdornment: (_jsx(InputAdornment, { position: "start", children: _jsx(CategoryIcon, { fontSize: "small" }) })),
                        } }), _jsx(TextField, { label: "Location", fullWidth: true, size: "small", InputProps: {
                            startAdornment: (_jsx(InputAdornment, { position: "start", children: _jsx(LocationOnIcon, { fontSize: "small" }) })),
                        } }), _jsx(TextField, { label: "Serial Number", fullWidth: true, size: "small", InputProps: {
                            startAdornment: (_jsx(InputAdornment, { position: "start", children: _jsx(ConfirmationNumberIcon, { fontSize: "small" }) })),
                        } }), _jsx(TextField, { label: "Maker", fullWidth: true, size: "small", InputProps: {
                            startAdornment: (_jsx(InputAdornment, { position: "start", children: _jsx(FactoryIcon, { fontSize: "small" }) })),
                        } }), _jsx(TextField, { label: "Model", fullWidth: true, size: "small", InputProps: {
                            startAdornment: (_jsx(InputAdornment, { position: "start", children: _jsx(MemoryIcon, { fontSize: "small" }) })),
                        } }), [1, 2, 3].map((i) => (_jsx(TextField, { label: `Comment ${i}`, fullWidth: true, size: "small", InputProps: {
                            startAdornment: (_jsx(InputAdornment, { position: "start", children: _jsx(CommentIcon, { fontSize: "small" }) })),
                        } }, i))), _jsx(TextField, { label: "Parent", fullWidth: true, size: "small", InputProps: {
                            startAdornment: (_jsx(InputAdornment, { position: "start", children: _jsx(GroupsIcon, { fontSize: "small" }) })),
                        } }), _jsx(TextField, { label: "Component Type Code", fullWidth: true, size: "small", InputProps: {
                            startAdornment: (_jsx(InputAdornment, { position: "start", children: _jsx(QrCode2Icon, { fontSize: "small" }) })),
                        } }), _jsx(TextField, { label: "Model Type", fullWidth: true, size: "small", InputProps: {
                            startAdornment: (_jsx(InputAdornment, { position: "start", children: _jsx(BuildIcon, { fontSize: "small" }) })),
                        } }), _jsx(TextField, { label: "Status", fullWidth: true, size: "small", InputProps: {
                            startAdornment: (_jsx(InputAdornment, { position: "start", children: _jsx(InfoIcon, { fontSize: "small" }) })),
                        } }), _jsx(TextField, { label: "Asset No", fullWidth: true, size: "small", InputProps: {
                            startAdornment: (_jsx(InputAdornment, { position: "start", children: _jsx(BadgeIcon, { fontSize: "small" }) })),
                        } }), _jsx(TextField, { label: "Sort No", fullWidth: true, size: "small", InputProps: {
                            startAdornment: (_jsx(InputAdornment, { position: "start", children: _jsx(FormatListNumberedIcon, { fontSize: "small" }) })),
                        } }), _jsx(FormControlLabel, { control: _jsx(Checkbox, {}), label: "Critical Component" })] }), _jsxs(Box, { display: "flex", gap: 1, children: [_jsx(Button, { size: "small", variant: "contained", startIcon: _jsx(SaveIcon, {}), onClick: handleSave, children: "Save" }), _jsx(Button, { size: "small", variant: "outlined", startIcon: _jsx(AddIcon, {}), children: "New" }), _jsx(Button, { size: "small", variant: "outlined", color: "error", startIcon: _jsx(DeleteIcon, {}), children: "Delete" }), _jsx(Button, { size: "small", variant: "outlined", startIcon: _jsx(PrintIcon, {}), children: "Print" }), _jsx(Button, { size: "small", variant: "outlined", startIcon: _jsx(DownloadIcon, {}), children: "Download All Attachments" }), _jsx(Button, { size: "small", variant: "outlined", startIcon: _jsx(AccountTreeIcon, {}), children: "Tree Nodes List" }), _jsx(Button, { size: "small", variant: "outlined", startIcon: _jsx(FileDownloadIcon, {}), children: "Export to Excel" })] })] }));
};
export default TabGeneral;
