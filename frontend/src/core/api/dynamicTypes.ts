import type { operations } from "./generated/api.types";

export type DynamicResponse<K extends keyof operations> =
  operations[K] extends {
    responses: { 200: { content: { "application/json": infer R } } };
  }
    ? R
    : never;

export type DynamicCreate<K extends keyof operations> =
  K extends `post${string}`
    ? operations[K] extends {
        requestBody: { content: { "application/json": infer R } };
      }
      ? R
      : never
    : never;

export type DynamicUpdate<K extends keyof operations> = K extends `put${string}`
  ? operations[K] extends {
      requestBody: { content: { "application/json": infer R } };
    }
    ? R
    : never
  : never;

export type DynamicDelete<K extends keyof operations> =
  K extends `delete${string}`
    ? operations[K] extends {
        requestBody: { content: { "application/json": infer R } };
      }
      ? R
      : never
    : never;

type OriginalQuery<K extends keyof operations> =
  operations[K]["parameters"]["query"];

// گام ۲: تعریف فیلدهای مورد نیاز با نوع جدید
type FilterAndIncludeFields = {
  filter?: object | any;
  include?: object | any;
};

// گام ۳: نوع کمکی برای اعمال بازنویسی روی تک‌تک اعضای Union
type OverrideUnion<T> = T extends object
  ? Omit<T, keyof FilterAndIncludeFields> & FilterAndIncludeFields
  : T;

export type DynamicQuery<K extends keyof operations> = OverrideUnion<
  OriginalQuery<K>
>;
