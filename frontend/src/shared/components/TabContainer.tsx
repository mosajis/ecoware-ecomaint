import { ReactNode, CSSProperties } from "react";
import { Box, BoxProps } from "@mui/material";

type TabContainerProps = {
  children?: ReactNode;
  style?: CSSProperties;
  boxProps?: BoxProps;
};

export default function TabContainer({
  children,
  style,
  boxProps,
}: TabContainerProps) {
  return (
    <Box
      sx={(theme) => ({
        flex: 1,
        border: `1px solid ${(theme.vars || theme).palette.divider}`,
        borderTop: 0,
        borderRadius: "0 0 8px 8px",
        height: "100%",
        maxHeight: "calc(100% - 42px)",
        ...style,
      })}
      {...boxProps}
    >
      {children}
    </Box>
  );
}
