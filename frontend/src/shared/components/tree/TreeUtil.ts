export function buildTreeMap<T>(
  data: T[],
  keyId: keyof T,
  parentKeyId?: keyof T
) {
  const map: Record<string, any> = {}

  // 1. ساخت نودها
  for (const item of data) {
    const id = String(item[keyId])
    map[id] = {
      index: id,
      id,
      children: [],
      isFolder: false,
      data: item,
    }
  }

  // 2. اتصال child → parent
  for (const item of data) {
    const id = String(item[keyId])
    const parentId = parentKeyId ? String(item[parentKeyId]) : null

    if (parentId && map[parentId]) {
      map[parentId].children.push(id)
      map[parentId].isFolder = true
    }
  }

  // 3. تضمین root
  if (!map.root) {
    map.root = {
      index: 'root',
      id: 'root',
      children: [],
      isFolder: true,
      data: 'Root',
    }
  }

  // 4. همه orphanها (بدون parent یا parent غایب) رو زیر root اضافه کن
  for (const item of data) {
    const id = String(item[keyId])
    const parentId = parentKeyId ? String(item[parentKeyId]) : null
    if (!parentId || !map[parentId]) {
      if (id !== 'root') {
        map.root.children.push(id)
        map[id].parentId = 'root'
        map.root.isFolder = true
      }
    }
  }

  return map
}
