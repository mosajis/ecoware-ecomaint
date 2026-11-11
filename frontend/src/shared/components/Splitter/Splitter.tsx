import { Split } from "@geoffcox/react-splitter";
import { useTheme } from "@mui/material/styles";
import { ReactNode, useState } from "react";

import "./Splitter.css";

interface SplitterProps {
  children: ReactNode[];
  horizontal?: boolean;
  initialPrimarySize?: string;
  resetOnDoubleClick?: boolean;
  minPrimarySize?: string;
  minSecondarySize?: string;
  splitterSize?: string;

  collapsed?: boolean;
  collapsedSecondarySize?: string;
}

const Splitter = ({
  children,
  horizontal = false,
  initialPrimarySize = "50%",
  resetOnDoubleClick = false,
  minPrimarySize,
  minSecondarySize,
  splitterSize,
  collapsed = true,
  collapsedSecondarySize = "45px",
  ...rest
}: SplitterProps) => {
  const theme = useTheme();

  // فقط برای حالت بالا / پایین
  const [isExpanded, setIsExpanded] = useState(!horizontal || !collapsed);

  const colors = {
    color: theme.palette.divider,
    hover: theme.palette.text.secondary,
    drag: theme.palette.primary.main,
  };

  const shouldCollapse = horizontal && collapsed;

  return (
    <Split
      key={shouldCollapse ? (isExpanded ? "expanded" : "collapsed") : "normal"}
      resetOnDoubleClick={resetOnDoubleClick}
      horizontal={horizontal}
      initialPrimarySize={
        shouldCollapse && !isExpanded
          ? `calc(100% - ${collapsedSecondarySize})`
          : initialPrimarySize
      }
      minPrimarySize={minPrimarySize}
      minSecondarySize={
        shouldCollapse && !isExpanded
          ? collapsedSecondarySize
          : minSecondarySize
      }
      splitterSize={splitterSize}
      defaultSplitterColors={colors}
      {...rest}
    >
      {children[0]}

      {shouldCollapse ? (
        <div
          style={{
            height: "100%",
            overflow: "hidden",
            cursor: !isExpanded ? "pointer" : undefined,
          }}
          onClick={() => {
            if (!isExpanded) {
              setIsExpanded(true);
            }
          }}
        >
          {children[1]}
        </div>
      ) : (
        children[1]
      )}
    </Split>
  );
};

export default Splitter;
