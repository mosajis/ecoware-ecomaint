import { Split } from "@geoffcox/react-splitter";
import { useTheme } from "@mui/material/styles";
import { ReactNode } from "react";

interface SplitterProps {
  children: ReactNode[];
  horizontal?: boolean;
  initialPrimarySize?: string;
  resetOnDoubleClick?: boolean;
  minPrimarySize?: string;
  minSecondarySize?: string;
  splitterSize?: string;
}

const Splitter = ({
  children,
  horizontal = false,
  initialPrimarySize = "50%",
  resetOnDoubleClick = false,
  minPrimarySize,
  minSecondarySize,
  splitterSize,
  ...rest
}: SplitterProps) => {
  const theme = useTheme();

  const colors = {
    color: theme.palette.divider, // حالت معمولی
    hover: theme.palette.text.secondary, // وقتی موس روشه
    drag: theme.palette.primary.main, // موقع درگ
  };

  return (
    <Split
      horizontal={horizontal}
      initialPrimarySize={initialPrimarySize}
      resetOnDoubleClick={resetOnDoubleClick}
      minPrimarySize={minPrimarySize}
      minSecondarySize={minSecondarySize}
      splitterSize={splitterSize}
      defaultSplitterColors={colors}
      {...rest}
    >
      {children}
    </Split>
  );
};

export default Splitter;
