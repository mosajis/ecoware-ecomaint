import { useState, useEffect, useCallback } from "react";
import { TreeViewBaseItem } from "@mui/x-tree-view";

export type TreeNode<T> = TreeViewBaseItem & {
  parentId: string | null;
  children?: TreeNode<T>[];
  data?: T;
};

export function useTreeGrid<T, K extends string | number, P = undefined>(
  api: {
    getAll: (params?: P) => Promise<{ items: T[] }>;
    deleteById: (id: K) => Promise<any>;
  },
  mapper: (row: T) => TreeNode<T>,
  getId: (row: T) => K
) {
  const [rows, setRows] = useState<T[]>([]);
  const [treeItems, setTreeItems] = useState<TreeNode<T>[]>([]);
  const [loading, setLoading] = useState(false);

  // --- Helper: build tree from flat array ---
  const buildTree = useCallback((nodes: TreeNode<T>[]) => {
    const map = new Map<string, TreeNode<T>>();
    nodes.forEach((n) => map.set(n.id, { ...n, children: [] }));

    const roots: TreeNode<T>[] = [];
    map.forEach((node) => {
      if (node.parentId && map.has(node.parentId)) {
        (map.get(node.parentId)!.children ||= []).push(node);
      } else {
        roots.push(node);
      }
    });

    return roots;
  }, []);

  // --- Helper: flatten tree to array ---
  const flattenTree = useCallback((nodes: TreeNode<T>[]): TreeNode<T>[] => {
    return nodes.reduce<TreeNode<T>[]>((acc, n) => {
      const { children, ...rest } = n;
      return [
        ...acc,
        rest as TreeNode<T>,
        ...(children ? flattenTree(children) : []),
      ];
    }, []);
  }, []);

  // --- Fetch data (با پارامتر اختیاری) ---
  const fetchData = useCallback(
    async (params?: any) => {
      setLoading(true);
      try {
        const res = await api.getAll({ ...params, paginate: false });
        setRows(res.items);

        const nodes = res.items.map(mapper);
        setTreeItems(buildTree(nodes));
      } finally {
        setLoading(false);
      }
    },
    [api, mapper, buildTree]
  );

  // --- Delete row ---
  const handleDelete = useCallback(
    async (row: T) => {
      const id = getId(row);
      await api.deleteById(id);

      setRows((prev) => prev.filter((r) => getId(r) !== id));

      const removeFromTree = (nodes: TreeNode<T>[]): TreeNode<T>[] =>
        nodes
          .filter((n) => n.id !== id.toString())
          .map((n) => ({
            ...n,
            children: n.children ? removeFromTree(n.children) : [],
          }));

      setTreeItems((prev) => removeFromTree(prev));
    },
    [api, getId]
  );

  // --- Add or update row ---
  const handleFormSuccess = useCallback(
    (updatedRecord: T) => {
      const id = getId(updatedRecord);

      // Update rows
      setRows((prev) => {
        const exists = prev.find((r) => getId(r) === id);
        if (exists)
          return prev.map((r) => (getId(r) === id ? updatedRecord : r));
        return [updatedRecord, ...prev]; // create: add to top
      });

      // Update treeItems
      setTreeItems((prev) => {
        const flat = flattenTree(prev);
        const existingIndex = flat.findIndex((n) => n.id === id.toString());
        const newNode = mapper(updatedRecord);

        if (existingIndex > -1) {
          // Update: جای قبلی حفظ شود
          flat[existingIndex] = newNode;
        } else {
          // Create: به ابتدای array اضافه شود
          flat.unshift(newNode);
        }

        return buildTree(flat);
      });
    },
    [mapper, getId, flattenTree, buildTree]
  );

  // --- Refresh row ---
  const handleRefresh = useCallback(
    (params?: P) => fetchData(params),
    [fetchData]
  );

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    rows,
    treeItems,
    loading,
    fetchData,
    handleDelete,
    handleFormSuccess,
    handleRefresh, // اضافه شد
  };
}
