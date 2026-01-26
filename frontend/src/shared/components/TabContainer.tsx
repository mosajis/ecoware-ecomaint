import { ReactNode, CSSProperties } from "react";
import Box from "@mui/material/Box";
import type { BoxProps } from "@mui/material/Box";

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
      className="tab-container"
      sx={(theme) => ({
        flex: 1,
        border: `1px solid ${(theme.vars || theme).palette.divider}`,
        borderTop: 0,
        borderRadius: "0 0 8px 8px",
        height: "100%",
        maxHeight: "calc(100% - 44px)",
        p: 0.5,
        ...style,
      })}
      {...boxProps}
    >
      {children}
    </Box>
  );
}
