import { t } from "elysia";

export const buildResponseSchema = (base: any, full: any) => {
  const baseKeys = new Set(Object.keys(base.properties));
  const relations: Record<string, any> = {};

  for (const [key, value] of Object.entries(full.properties)) {
    if (!baseKeys.has(key)) {
      relations[key] = t.Optional(value as any);
    }
  }

  return t.Object({
    ...base.properties,
    ...relations,
  });
};
