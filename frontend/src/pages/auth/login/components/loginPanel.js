import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box } from "@mui/material";
import CheckCircleSharpIcon from "@mui/icons-material/CheckCircleSharp";
import ImgDarkBg from "@/assets/images/dark-image.png";
export default function LoginInfoPanel() {
    const features = [
        {
            title: "Automated Equipment Monitoring",
            desc: "Continuously tracks machine conditions and predicts potential failures before they occur.",
        },
        {
            title: "Smart Service Scheduling",
            desc: "Uses performance data to plan precise and timely preventive maintenance tasks.",
        },
        {
            title: "Reduced Downtime and Costs",
            desc: "Detects issues early to minimize repair expenses and equipment downtime.",
        },
    ];
    return (_jsxs(Box, { visibility: {
            xs: "hidden",
            sm: "hidden",
            md: "visible",
            lg: "visible",
            xl: "visible",
        }, sx: {
            backgroundImage: `url(${ImgDarkBg})`,
            backgroundPosition: "bottom right",
            backgroundSize: "60%",
            backgroundRepeat: "no-repeat",
            backgroundColor: "black",
            boxShadow: {
                xs: "none",
                sm: "none",
                md: "none",
                lg: "inset 10px 0px 0px #bdbdbd,-9px 0px 0px #e6e6e6",
            },
            color: "white",
            borderRadius: {
                xs: "none",
                sm: "none",
                md: "3rem 3rem 0 0",
                lg: "3rem 0 0 3rem",
            },
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
            padding: "4rem",
        }, children: [_jsxs(Box, { fontSize: "2.5rem", fontWeight: "bold", children: ["Discover the Benefits of Using", " ", _jsx("span", { style: { color: "rgba(33, 87, 235, 1)" }, children: " ECO " }), "Maintenance System"] }), _jsx(Box, { pt: "4rem", display: "flex", flexDirection: "column", gap: 4, children: features.map((item, i) => (_jsxs(Box, { children: [_jsxs(Box, { fontSize: "1.5rem", fontWeight: "bold", pb: ".5rem", display: "flex", alignItems: "center", gap: 1, children: [_jsx(CheckCircleSharpIcon, {}), " ", item.title] }), _jsx(Box, { children: item.desc })] }, i))) })] }));
}
