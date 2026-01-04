import { ReactNode } from 'react'

export type TreeNode<T = any> = {
  id: string
  text: string
  label: ReactNode
  children?: TreeNode<T>[]
  data?: T
}

/* ---- Build Tree with Map for O(1) lookup ---- */
export function buildTree<T>(
  nodes: TreeNode<T>[],
  parentKeyId?: keyof T
): TreeNode<T>[] {
  const nodeMap = new Map<string, TreeNode<T>>()
  const roots: TreeNode<T>[] = []

  nodes.forEach(n => {
    nodeMap.set(n.id, { ...n, children: [] })
  })

  nodeMap.forEach(node => {
    if (!node.data || !parentKeyId) {
      roots.push(node)
      return
    }

    const parentId = String(node.data[parentKeyId])
    const parent = nodeMap.get(parentId)

    if (parent) {
      parent.children!.push(node)
    } else {
      roots.push(node)
    }
  })

  return roots
}

/* ---- Remove Node from Tree ---- */
export function removeNodeFromTree<T>(
  nodes: TreeNode<T>[],
  nodeId: string
): TreeNode<T>[] {
  return nodes
    .filter(n => n.id !== nodeId)
    .map(n => ({
      ...n,
      children: n.children ? removeNodeFromTree(n.children, nodeId) : undefined,
    }))
}

/* ---- Update Node in Tree ---- */
export function updateNodeInTree<T>(
  nodes: TreeNode<T>[],
  nodeId: string,
  updatedNode: TreeNode<T>
): TreeNode<T>[] {
  return nodes.map(n => {
    if (n.id === nodeId) {
      return {
        ...updatedNode,
        children: n.children,
      }
    }
    return {
      ...n,
      children: n.children
        ? updateNodeInTree(n.children, nodeId, updatedNode)
        : undefined,
    }
  })
}

/* ---- Find Node in Tree ---- */
export function findNodeInTree<T>(
  nodes: TreeNode<T>[],
  nodeId: string
): TreeNode<T> | null {
  for (const node of nodes) {
    if (node.id === nodeId) return node
    if (node.children) {
      const found = findNodeInTree(node.children, nodeId)
      if (found) return found
    }
  }
  return null
}

/* ---- Filter Tree ---- */
export function filterTree<T>(
  nodes: TreeNode<T>[],
  search: string
): TreeNode<T>[] {
  if (!search) return nodes

  const s = search.toLowerCase()

  const walk = (node: TreeNode<T>): TreeNode<T> | null => {
    const match = node.text.toLowerCase().includes(s)
    const children =
      node.children
        ?.map(walk)
        .filter((child): child is TreeNode<T> => child !== null) || []

    return match || children.length ? { ...node, children } : null
  }

  return nodes.map(walk).filter((node): node is TreeNode<T> => node !== null)
}

/* ---- Debounce Utility ---- */
export function createDebounce<T extends (...args: any[]) => void>(
  fn: T,
  delay: number
): T {
  let timeoutId: NodeJS.Timeout
  return ((...args: any[]) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn(...args), delay)
  }) as T
}

/* ---- Build ID Set ---- */
export function buildIdSet<T>(nodes: TreeNode<T>[]): Set<string> {
  const idSet = new Set<string>()

  const walk = (nodeList: TreeNode<T>[]) => {
    nodeList.forEach(node => {
      idSet.add(node.id)
      if (node.children) walk(node.children)
    })
  }

  walk(nodes)
  return idSet
}

/* ---- Build Data Map ---- */
export function buildDataMap<T>(nodes: TreeNode<T>[]): Map<string, T> {
  const dataMap = new Map<string, T>()

  const walk = (nodeList: TreeNode<T>[]) => {
    nodeList.forEach(node => {
      if (node.data) dataMap.set(node.id, node.data)
      if (node.children) walk(node.children)
    })
  }

  walk(nodes)
  return dataMap
}

/* ---- Get Selected Data ---- */
export function getSelectedData<T>(
  ids: string[],
  dataMap: Map<string, T>
): T[] {
  return ids
    .map(id => dataMap.get(id))
    .filter((item): item is T => item !== undefined)
}
