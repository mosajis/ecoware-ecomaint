import Splitter from "@/shared/components/Splitter";
import CustomizedDataGrid from "@/shared/components/dataGrid/DataGrid";
import CustomizedTree from "@/shared/components/tree/Tree";
import LocationFormDialog from "./LocationFormDialog";
import { useState, useEffect, useMemo, useCallback } from "react";
import { tblLocation, TypeTblLocation } from "@/core/api/generated/api";
import { dataGridActionColumn } from "@/shared/components/dataGrid/DataGridActionsColumn";
import { TreeViewBaseItem } from "@mui/x-tree-view";

export default function LocationListPage() {
  const [treeItems, setTreeItems] = useState<any[]>([]);
  const [rows, setRows] = useState<TypeTblLocation[]>([]);
  const [openForm, setOpenForm] = useState(false);
  const [mode, setMode] = useState<"create" | "update">("create");
  const [selectedRowId, setSelectedRowId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  // === Fetch data manually ===
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await tblLocation.getAll({ paginate: false });
      setRows(res.items);

      // Build tree
      const tree = res.items.map(
        (x): TreeViewBaseItem & { parentId: number | null } => ({
          id: x.locationId.toString(),
          label: x.name ?? "",
          parentId: x.parentLocationId,
          children: [],
        })
      );

      const map = new Map<string, (typeof tree)[0]>();
      tree.forEach((n) => map.set(n.id, n));

      const roots: (typeof tree)[0][] = [];
      map.forEach((node) => {
        if (node.parentId && map.has(node.parentId.toString())) {
          (map.get(node.parentId.toString())!.children ||= []).push(node);
        } else {
          roots.push(node);
        }
      });

      setTreeItems(roots);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // === Handlers ===
  const handleCreate = useCallback(() => {
    setSelectedRowId(null);
    setMode("create");
    setOpenForm(true);
  }, []);

  const handleEdit = useCallback((row: TypeTblLocation) => {
    setSelectedRowId(row.locationId);
    setMode("update");
    setOpenForm(true);
  }, []);

  const handleDelete = useCallback(
    async (row: TypeTblLocation) => {
      try {
        await tblLocation.deleteById(row.locationId);

        // حذف سریع از state
        setRows((prev) => prev.filter((r) => r.locationId !== row.locationId));

        const removeFromTree = (nodes: typeof treeItems): typeof treeItems =>
          nodes
            .filter((n) => n.id !== row.locationId.toString())
            .map((n) => ({
              ...n,
              children: n.children ? removeFromTree(n.children) : [],
            }));
        setTreeItems((prev) => removeFromTree(prev));
      } catch (err) {
        console.error("Delete failed", err);
      }
    },
    [treeItems]
  );

  const handleFormSuccess = useCallback(
    async (updatedRecord: TypeTblLocation) => {
      // اگر ردیف موجود بود => update، در غیر این صورت add
      setRows((prev) => {
        const exists = prev.find(
          (r) => r.locationId === updatedRecord.locationId
        );
        if (exists) {
          return prev.map((r) =>
            r.locationId === updatedRecord.locationId ? updatedRecord : r
          );
        } else {
          return [...prev, updatedRecord];
        }
      });

      const updateTree = (nodes: typeof treeItems): typeof treeItems => {
        return nodes.map((n) => {
          if (n.id === updatedRecord.locationId.toString()) {
            return { ...n, label: updatedRecord.name ?? "" };
          }
          if (n.children) return { ...n, children: updateTree(n.children) };
          return n;
        });
      };

      // اگر ردیف جدید است، rebuild tree
      const exists = treeItems.find(
        (n) => n.id === updatedRecord.locationId.toString()
      );
      if (exists) {
        setTreeItems((prev) => updateTree(prev));
      } else {
        await fetchData(); // fetch جدید فقط برای ردیف جدید (یا می‌توانیم دست‌کاری کنیم بدون fetch)
      }

      setOpenForm(false);
    },
    [treeItems, fetchData]
  );

  // === Columns ===
  const columns = useMemo(
    () => [
      { field: "locationCode", headerName: "Code" },
      { field: "name", headerName: "Name", flex: 1 },
      { field: "orderId", headerName: "Order" },
      dataGridActionColumn({ onEdit: handleEdit, onDelete: handleDelete }),
    ],
    [handleEdit, handleDelete]
  );

  return (
    <>
      <Splitter>
        <CustomizedTree label="Tree View" items={treeItems} />
        <CustomizedDataGrid
          loading={loading}
          showToolbar
          label="List View"
          rows={rows}
          columns={columns}
          onAddClick={handleCreate}
          getRowId={(row) => row.locationId}
        />
      </Splitter>

      {openForm && (
        <LocationFormDialog
          open={openForm}
          mode={mode}
          recordId={selectedRowId}
          onClose={() => setOpenForm(false)}
          onSuccess={handleFormSuccess}
        />
      )}
    </>
  );
}
