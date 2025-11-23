import { useState, useEffect, useCallback } from "react";
import { TreeViewBaseItem } from "@mui/x-tree-view";

export type QueryParams = {
  page?: number;
  perPage?: number;
  sort?: string;
  filter?: string;
  include?: string;
  paginate?: boolean;
  force?: boolean;
};

export type TreeNode<T> = TreeViewBaseItem & {
  parentId: string | null;
  children?: TreeNode<T>[];
  data?: T;
};

export function useDataTree<T, K extends string | number>(
  api: {
    getAll: (params?: QueryParams) => Promise<{ items: T[] }>;
    deleteById: (id: K) => Promise<any>;
  },
  mapper: (row: T) => TreeNode<T>,
  getId: (row: T) => K
) {
  const [rows, setRows] = useState<T[]>([]);
  const [treeItems, setTreeItems] = useState<TreeNode<T>[]>([]);
  const [loading, setLoading] = useState(false);

  const buildTree = useCallback((nodes: TreeNode<T>[]) => {
    const map = new Map<string, TreeNode<T>>();
    nodes.forEach((n) => map.set(n.id.toString(), { ...n, children: [] }));

    const roots: TreeNode<T>[] = [];
    map.forEach((node) => {
      const parentId = node.parentId?.toString() ?? null;

      if (parentId && map.has(parentId)) {
        (map.get(parentId)!.children ||= []).push(node);
      } else {
        roots.push(node);
      }
    });

    return roots;
  }, []);

  // flatten
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

  // --- fetchData with QueryParams ---
  const fetchData = useCallback(
    async (params?: QueryParams) => {
      setLoading(true);
      try {
        const res = await api.getAll({
          ...params,
          paginate: false, // ثابت + safe
        });

        setRows(res.items);

        const nodes = res.items.map(mapper);
        setTreeItems(buildTree(nodes));
      } finally {
        setLoading(false);
      }
    },
    [api, mapper, buildTree]
  );

  const handleDelete = useCallback(
    async (row: T) => {
      setLoading(true);
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
      setLoading(false);
    },
    [api, getId, setLoading]
  );

  const handleFormSuccess = useCallback(
    (updatedRecord: T) => {
      setLoading(true);
      const id = getId(updatedRecord);

      setRows((prev) => {
        const exists = prev.find((r) => getId(r) === id);
        if (exists)
          return prev.map((r) => (getId(r) === id ? updatedRecord : r));
        return [updatedRecord, ...prev];
      });

      setTreeItems((prev) => {
        const flat = flattenTree(prev);
        const idx = flat.findIndex((n) => n.id === id.toString());
        const newNode = mapper(updatedRecord);

        if (idx > -1) flat[idx] = newNode;
        else flat.unshift(newNode);

        return buildTree(flat);
      });

      setLoading(false);
    },
    [mapper, getId, flattenTree, buildTree]
  );

  const handleRefresh = useCallback(
    (params?: QueryParams) => fetchData(params),
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
    handleRefresh,
  };
}
