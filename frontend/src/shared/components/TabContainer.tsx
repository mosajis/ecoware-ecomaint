import React, { ReactNode, CSSProperties } from "react";
import { Box, BoxProps } from "@mui/material";

type TabContainerProps = {
  children: ReactNode;
  style?: CSSProperties; // قابلیت اضافه کردن استایل دلخواه
  boxProps?: BoxProps; // انتقال سایر props به Box
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
        ...style,
      })}
      {...boxProps}
    >
      {children}
    </Box>
  );
}
