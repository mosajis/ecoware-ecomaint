import { createRoute } from "@tanstack/react-router";
import { LazyRoute } from "./lazyRoute";

// تایپ برای route detail که با id عددی کار می‌کنه
type DetailRouteParams = {
  id: number;
};

type DetailRouteOptions<T extends Record<string, unknown>> = {
  parent: any; // parent route
  path: string; // مسیر route، مثلا '/$id'
  Component: React.FC<any>; // کامپوننت صفحه
  extraSearch?: (search: Record<string, unknown>) => T; // اگر خواستی search اضافه داشته باشی
};

// helper برای پارس/استرینگ id عددی
const numberIdParam = (key: string) => ({
  parse: (params: Record<string, string>) => ({ [key]: Number(params[key]) }),
  stringify: (obj: Record<string, number>) => ({ [key]: String(obj[key]) }),
});

// helper برای breadcrumb پیش‌فرض
const defaultBreadcrumb = (search: Record<string, unknown>) => ({
  breadcrumb: (search?.breadcrumb as string) || undefined,
});

// factory اصلی
export function createDetailRoute<T extends Record<string, unknown> = {}>({
  parent,
  path,
  Component,
  extraSearch,
}: DetailRouteOptions<T>) {
  return createRoute({
    getParentRoute: () => parent,
    path,
    validateSearch: (search) => ({
      ...defaultBreadcrumb(search),
      ...(extraSearch ? extraSearch(search) : {}),
    }),
    params: numberIdParam("id"),
    component: () => <LazyRoute Component={Component} />,
    beforeLoad: ({ search }) => ({
      ...defaultBreadcrumb(search),
      ...(extraSearch ? extraSearch(search) : {}),
    }),
  });
}
