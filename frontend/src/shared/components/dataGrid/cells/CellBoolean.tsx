import Check from "@mui/icons-material/Check";
import Cancel from "@mui/icons-material/Cancel";
import Box from "@mui/material/Box";
import { FC } from "react";

type CellBooleanProps = {
  status?: boolean | null | number | undefined;
  size?: "small" | "medium" | "large";
};

const CellBoolean: FC<CellBooleanProps> = ({ status, size = "small" }) => {
  return (
    <Box display="flex" alignItems="center" height="100%">
      {status ? (
        <Check color="success" fontSize={size} />
      ) : (
        <Cancel color="error" fontSize={size} />
      )}
    </Box>
  );
};

export default CellBoolean;
