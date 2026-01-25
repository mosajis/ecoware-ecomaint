import { z } from "zod";

/**
 * Converts empty string ("") to null automatically.
 * Useful for text inputs that may submit "" instead of null.
 */
export const nullableString = z
  .string()
  .transform((v) => (v === "" ? null : v))
  .nullable()
  .optional();

/**
 * Converts empty string ("") to undefined automatically.
 */
export const optionalString = z
  .string()
  .transform((v) => (v === "" ? undefined : v))
  .optional();

export function normalizeFormData<T extends Record<string, any>>(data: T): T {
  if (!data) return data;
  const result: any = {};
  for (const key in data) {
    const value = data[key];
    if (value === null) result[key] = "";
    else if (typeof value === "object" && !Array.isArray(value))
      result[key] = normalizeFormData(value);
    else result[key] = value;
  }
  return result;
}

export const daysAgo = (days: number) =>
  new Date(Date.now() - days * 24 * 60 * 60 * 1000);

export const toPercent = (value: number, total: number) =>
  total === 0 ? 0 : ((value / total) * 100).toFixed(2);
