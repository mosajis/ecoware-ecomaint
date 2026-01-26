export interface TreeDataMapper<T> {
  itemsMap: Map<number, T>;
  childrenMap: Map<number, number[]>;
  rootIds: number[];
}

export function mapToTree<T extends Record<string, any>>(
  items: T[],
  idKey: keyof T,
  parentKey: keyof T,
): TreeDataMapper<T> {
  const itemsMap = new Map<number, T>();
  const childrenMap = new Map<number, number[]>();
  const rootIds: number[] = [];

  // تنها یک حلقه - بهینه‌سازی از O(2n) به O(n)
  for (let i = 0, len = items.length; i < len; i++) {
    const item = items[i];
    const id = Number(item[idKey]);
    const parentRaw = item[parentKey];

    itemsMap.set(id, item);

    // بهینه‌سازی: چک کردن null/undefined در یک شرط
    const parentId =
      parentRaw === null || parentRaw === undefined ? 0 : Number(parentRaw);

    if (parentId === 0) {
      rootIds.push(id);
    } else {
      // بهینه‌سازی: استفاده از has() برای جلوگیری از ساخت آرایه موقت
      if (!childrenMap.has(parentId)) {
        childrenMap.set(parentId, [id]);
      } else {
        childrenMap.get(parentId)!.push(id);
      }
    }
  }

  childrenMap.set(0, rootIds);

  return { itemsMap, childrenMap, rootIds };
}
