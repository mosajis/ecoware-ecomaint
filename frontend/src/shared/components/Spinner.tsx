import React from "react";
import { Box, CircularProgress } from "@mui/material";

interface SpinnerProps {
  height?: string | number; // قابل تنظیم ارتفاع
  color?: "primary" | "secondary" | "inherit"; // رنگ
}

const Spinner: React.FC<SpinnerProps> = ({
  height = "100%",
  color = "inherit",
}) => {
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