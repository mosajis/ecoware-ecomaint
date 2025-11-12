import { getDesignTokens } from "@/shared/theme/themePrimitives";
import styled from "@emotion/styled";
import { alpha, Box, Typography, useColorScheme } from "@mui/material";
import {
  RichTreeView,
  TreeItem,
  treeItemClasses,
  type RichTreeViewProps,
} from "@mui/x-tree-view";

const CustomTreeItem = styled(TreeItem)(({ theme }) => {
  const { mode, setMode } = useColorScheme();

  // (theme.vars || theme.palette.background.paper

  return {
    position: "relative",

    [`& .${treeItemClasses.content}`]: {
      position: "relative",
      // @ts-ignore
      padding: theme.spacing(0.3, 1),
      // @ts-ignore
      margin: theme.spacing(0.3, 0),
      "&::before": {
        content: '""',
        position: "absolute",
        top: "50%",
        left: -18,
        width: 18,
        height: 1,
        // @ts-ignore
        borderBottom: `1px dashed ${getDesignTokens(mode).palette.grey[300]}}`,
      },
    },

    [`& .${treeItemClasses.iconContainer}`]: {
      opacity: 0,
      width: 0,
      ":has(svg)": {
        opacity: 1,
        width: "auto",
      },
    },

    [`& .${treeItemClasses.groupTransition}`]: {
      marginLeft: 15,
      paddingLeft: 18,
      // @ts-ignore
      borderLeft: `1px dashed ${getDesignTokens(mode).palette.grey[300]}`,
    },
  };
});

export default CustomTreeItem;
