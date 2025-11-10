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

export type DynamicQuery<K extends keyof operations> =
  operations[K]["parameters"]["query"];
