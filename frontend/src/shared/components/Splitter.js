import { jsx as _jsx } from "react/jsx-runtime";
import { Split } from "@geoffcox/react-splitter";
import { useTheme } from "@mui/material/styles";
const Splitter = ({ children, horizontal = false, initialPrimarySize = "50%", resetOnDoubleClick = false, minPrimarySize, minSecondarySize, splitterSize, ...rest }) => {
    const theme = useTheme();
    const colors = {
        color: theme.palette.divider, // حالت معمولی
        hover: theme.palette.text.secondary, // وقتی موس روشه
        drag: theme.palette.primary.main, // موقع درگ
    };
    return (_jsx(Split, { horizontal: horizontal, initialPrimarySize: initialPrimarySize, resetOnDoubleClick: resetOnDoubleClick, minPrimarySize: minPrimarySize, minSecondarySize: minSecondarySize, splitterSize: splitterSize, defaultSplitterColors: colors, ...rest, children: children }));
};
export default Splitter;
