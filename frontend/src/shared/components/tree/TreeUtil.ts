export interface TreeDataMapper<T> {
  itemsMap: Map<number, T>
  childrenMap: Map<number, number[]>
  rootIds: number[]
}

export function mapToTree<T extends Record<string, any>>(
  items: T[],
  idKey: keyof T,
  parentKey: keyof T
): TreeDataMapper<T> {
  const itemsMap = new Map<number, T>()
  const childrenMap = new Map<number, number[]>()
  const rootIds: number[] = []

  items.forEach(item => {
    const id = Number(item[idKey])
    itemsMap.set(id, item)
  })

  items.forEach(item => {
    const id = Number(item[idKey])
    const parentRaw = item[parentKey]
    const parentId =
      parentRaw === null || parentRaw === undefined ? 0 : Number(parentRaw)

    if (parentId === 0) {
      rootIds.push(id)
    } else {
      const children = childrenMap.get(parentId) || []
      children.push(id)
      childrenMap.set(parentId, children)
    }
  })

  childrenMap.set(0, rootIds)

  return { itemsMap, childrenMap, rootIds }
}
