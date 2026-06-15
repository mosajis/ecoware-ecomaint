import { t, type TSchema } from "elysia";

export const responseSchemaList = <T extends TSchema>(itemSchema: T) =>
  t.Object({
    items: t.Array(itemSchema),
    total: t.Number(),
    page: t.Number(),
    perPage: t.Number(),
    totalPages: t.Number(),
  });
