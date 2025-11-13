import { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { RichTreeView, type TreeViewBaseItem } from "@mui/x-tree-view";
import Splitter from "@/shared/components/Splitter";
import CustomizedDataGrid from "@/shared/components/dataGrid/DataGrid";
import { tblLocation } from "@/core/api/generated/api";
import CustomizedTree from "@/shared/components/tree/Tree";

// ===== Model we use inside UI =====
interface LocationItem {
  id: number;
  parentId: number | null;
  name: string;
  code: string;
}

function buildTree(items: LocationItem[]): TreeViewBaseItem[] {
  const map = new Map<number, TreeViewBaseItem & { parentId: number | null }>();

  items.forEach((item) =>
    map.set(item.id, {
      id: item.id.toString(),
      label: item.name,
      parentId: item.parentId,
      children: [],
    })
  );

  const roots: TreeViewBaseItem[] = [];
  map.forEach((node) => {
    if (node.parentId && map.has(node.parentId)) {
      (map.get(node.parentId)!.children ||= []).push(node);
    } else {
      roots.push(node);
    }
  });
  return roots;
}

export default function Location() {
  const [treeItems, setTreeItems] = useState<TreeViewBaseItem[]>([]);
  const [rows, setRows] = useState<LocationItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  // ✅ Load all and build tree
  useEffect(() => {
    setLoading(true);
    tblLocation
      .getAll({
        paginate: false,
      })
      .then((res) => {
        const data: LocationItem[] = res.items.map((x) => ({
          id: x.locationId,
          parentId: x.parentLocationId,
          name: x.name ?? "",
          code: x.locationCode ?? "",
          orderId: x.orderId,
        }));
        setTreeItems(buildTree(data));
        setRows(data);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const columns = [
    { field: "code", headerName: "Code" },
    { field: "name", headerName: "Name", flex: 1 },
    { field: "orderId", headerName: "Order Id" },
  ];

  return (
    <Splitter>
      <CustomizedTree label="Tree View" items={treeItems} />
      <CustomizedDataGrid
        loading={loading}
        showToolbar
        label="List View"
        rows={rows}
        columns={columns}
      />
    </Splitter>
  );
}
