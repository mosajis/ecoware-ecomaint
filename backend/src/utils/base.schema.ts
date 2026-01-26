import { t } from "elysia";
import type { TSchema } from "@sinclair/typebox";

function makeFlexibleDeep(schema: TSchema): TSchema {
  // ✅ Union / anyOf
  if ("anyOf" in schema && Array.isArray(schema.anyOf)) {
    return {
      ...schema,
      anyOf: schema.anyOf.map(makeFlexibleDeep),
    } as TSchema;
  }

  // ✅ Optional (Type.Optional → union با undefined)
  if ("type" in schema && schema.type === "null") {
    return schema;
  }

  // ✅ Object
  if (schema.type === "object" && "properties" in schema) {
    const props: Record<string, TSchema> = {};

    for (const [key, value] of Object.entries(schema.properties)) {
      props[key] = makeFlexibleDeep(value as TSchema);
    }

    return t.Object(props, {
      additionalProperties: true, // 👈 کلید نجات
    });
  }

  // سایر typeها
  return schema;
}
export const buildResponseSchema = (base: any, full: any) => {
  const baseKeys = new Set(Object.keys(base.properties));
  const relations: Record<string, any> = {};

  for (const [key, value] of Object.entries(full.properties)) {
    if (!baseKeys.has(key)) {
      relations[key] = t.Optional(makeFlexibleDeep(value as any));
    }
  }

  return t.Object(
    {
      ...base.properties,
      ...relations,
    },
    {
      additionalProperties: false, // root strict
    },
  );
};
