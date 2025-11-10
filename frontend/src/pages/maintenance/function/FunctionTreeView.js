import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { Box, CircularProgress } from "@mui/material";
import { TreeItem } from "@mui/x-tree-view";
import { tblComponentUnit } from "@/core/api/generated/api";
const ComponentUnitTreeView = () => {
    const [treeData, setTreeData] = useState([]);
    const [loading, setLoading] = useState(true);
    const mapToTree = (data) => {
        return data.map(item => ({
            title: item.compNo,
            key: item.compId,
            // اگر children داری:
            // children: item.children ? mapToTree(item.children) : undefined,
        }));
    };
    useEffect(() => {
        setLoading(true);
        tblComponentUnit.getAll().then(data => {
            const formatted = mapToTree(data.items);
            setTreeData(formatted);
            setLoading(false);
        });
    }, []);
    const renderTreeItems = (nodes) => {
        return nodes.map(node => (_jsx(TreeItem, { itemId: String(node.key), label: node.title || "", children: node.children ? renderTreeItems(node.children) : null }, node.key)));
    };
    return (_jsx(Box, { children: loading ? (_jsx(Box, { display: "flex", justifyContent: "center", mt: 2, children: _jsx(CircularProgress, {}) })) : (_jsx("div", { children: "tree" })
        // <RichTreeView
        //   defaultExpandedItems={treeData.map(n => String(n.key))}
        //   sx={{ height: "100%", overflowY: "auto" }}
        // >
        //   {renderTreeItems(treeData)}
        // </RichTreeView>
        ) }));
};
export default ComponentUnitTreeView;
