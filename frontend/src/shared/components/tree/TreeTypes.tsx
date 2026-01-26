// تایپ اصلی Location از API
export interface TypeTblLocation {
  locationId: number;
  parentLocationId: number;
  name: string;
}

// تایپ‌های مربوط به Tree Mapper
export interface TreeDataMapper<T> {
  itemsMap: Map<number, T>;
  childrenMap: Map<number, number[]>;
  rootIds: number[];
}

// تایپ‌های Hook
export interface UseTreeDataOptions<T> {
  request: () => Promise<{ data: { items: T[] } }>;
  mapper: (items: T[]) => TreeDataMapper<T>;
}

export interface UseTreeDataReturn<T> {
  dataTreeItems: TreeDataMapper<T> | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

// تایپ‌های Component
export interface LocationTreeProps {
  data: TreeDataMapper<TypeTblLocation>;
  onItemSelect?: (locationId: number) => void;
  className?: string;
}

// تایپ‌های API Response (اگر نیاز داشته باشید)
export interface DynamicResponse<T extends string> {
  items: T extends "getTblLocation" ? TypeTblLocation[] : never;
  total?: number;
  page?: number;
  pageSize?: number;
}

export interface DynamicQuery<T extends string> {
  page?: number;
  pageSize?: number;
  search?: string;
  filters?: Record<string, any>;
}

// تایپ‌های helper
export type LocationId = number;
export type ParentLocationId = number;

// Utility Types
export type RecursivePartial<T> = {
  [P in keyof T]?: RecursivePartial<T[P]>;
};

export type DeepReadonly<T> = {
  readonly [P in keyof T]: DeepReadonly<T[P]>;
};
