import Cancel from "@mui/icons-material/Cancel";
import CheckCircle from "@mui/icons-material/CheckCircle";
import Box from "@mui/material/Box";

import { FC } from "react";

type StatusIconProps = {
  status?: boolean | null;
  size?: "small" | "medium" | "large";
};

export const StatusIcon: FC<StatusIconProps> = ({ status, size = "small" }) => {
  if (status)
    return (
      <Box display={"flex"} alignItems={"center"} height={"100%"}>
        <CheckCircle color="success" fontSize={size} />
      </Box>
    );
  return (
    <Box display={"flex"} alignItems={"center"} height={"100%"}>
      <Cancel color="error" fontSize={size} />
    </Box>
  );
};
