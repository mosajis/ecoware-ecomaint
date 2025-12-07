import { FC } from "react";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";

interface SpinnerProps {
  height?: string | number; // قابل تنظیم ارتفاع
  color?: "primary" | "secondary" | "inherit"; // رنگ
}

const Spinner: FC<SpinnerProps> = ({ height = "100%", color = "inherit" }) => {
  return (
    <Box
      sx={{
        height,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <CircularProgress color={color} />
    </Box>
  );
};

export default Spinner;
