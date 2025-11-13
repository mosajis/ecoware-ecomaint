import React, { useEffect, useState } from "react";
import { Box, CircularProgress } from "@mui/material";
import { TreeItem } from "@mui/x-tree-view";
import { tblComponentUnit } from "@/core/api/generated/api";
import type { DynamicResponse } from "@/core/api/dynamicTypes";

type ComponentUnit = DynamicResponse<"getTblComponentUnit">["items"][number];

type TypeTree = {
  title: string | null;
  key: number;
  children?: TypeTree[];
};

const ComponentUnitTreeView = () => {
  const [treeData, setTreeData] = useState<TypeTree[]>([]);
  const [loading, setLoading] = useState(true);

  const mapToTree = (data: ComponentUnit[]): TypeTree[] => {
    return data.map((item) => ({
      title: item.compNo,
      key: item.compId,
      // اگر children داری:
      // children: item.children ? mapToTree(item.children) : undefined,
    }));
  };

  useEffect(() => {
    setLoading(true);
    tblComponentUnit.getAll().then((data) => {
      const formatted = mapToTree(data.items);
      setTreeData(formatted);
      setLoading(false);
    });
  }, []);

  const renderTreeItems = (nodes: TypeTree[]) => {
    return nodes.map((node) => (
      <TreeItem
        key={node.key}
        itemId={String(node.key)}
        label={node.title || ""}
      >
        {node.children ? renderTreeItems(node.children) : null}
      </TreeItem>
    ));
  };

  return (
    <Box>
      {loading ? (
        <Box display="flex" justifyContent="center" mt={2}>
          <CircularProgress />
        </Box>
      ) : (
        <div>tree</div>
        // <RichTreeView
        //   defaultExpandedItems={treeData.map(n => String(n.key))}
        //   sx={{ height: "100%", overflowY: "auto" }}
        // >
        //   {renderTreeItems(treeData)}
        // </RichTreeView>
      )}
    </Box>
  );
};

export default ComponentUnitTreeView;
