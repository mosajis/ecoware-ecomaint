import { Elysia, t } from "elysia";
import { BaseService } from "./base.service";

/* ---------------------------------- */
/* Query Schema */
/* ---------------------------------- */
export const querySchema = t.Object({
  page: t.Optional(t.Number()),
  perPage: t.Optional(t.Number()),
  sort: t.Optional(t.String()),
  filter: t.Optional(t.String()),
  include: t.Optional(t.String()),
  select: t.Optional(t.String()),
  paginate: t.Optional(t.Boolean()),
  force: t.Optional(t.Boolean()),
});

/* ---------------------------------- */
/* Sort Parser */
/* ---------------------------------- */
export function parseSortString(sort?: string): Record<string, "asc" | "desc"> {
  if (!sort) return {};
  return sort.split(",").reduce(
    (acc, pair) => {
      const [field, order] = pair.split(":");
      if (field && (order === "asc" || order === "desc")) {
        acc[field] = order;
      }
      return acc;
    },
    {} as Record<string, "asc" | "desc">,
  );
}

/* ---------------------------------- */
/* Scope Enforcer (internal) */
/* ---------------------------------- */
async function applyScope({
  filter,
  headers,
  ctx,
  enabled,
}: {
  filter: Record<string, any>;
  headers: Record<string, any>;
  ctx: any;
  enabled?: boolean;
}) {
  if (!enabled) return filter;

  const rawInstId = headers["x-inst-id"];

  // 👇 از ctx.user می‌گیریم (باید از auth middleware بیاد)
  const userId = ctx.user?.id;
  if (!userId) {
    throw new Error("Unauthorized");
  }

  // 👇 گرفتن instهای مجاز
  const rows = await ctx.prisma.tblUserInstallation.findMany({
    where: { userId },
    select: { instId: true },
  });

  const allowedIds = rows.map((r: any) => r.instId);

  // اگر header ارسال شده
  if (rawInstId !== undefined) {
    const instId = Number(rawInstId);

    if (!allowedIds.includes(instId)) {
      throw new Error("Forbidden: invalid instId");
    }

    return {
      ...filter,
      instId,
    };
  }

  // اگر header نبود → همه instهای مجاز
  return {
    ...filter,
    instId: { in: allowedIds },
  };
}

/* ---------------------------------- */
/* Controller Options */
/* ---------------------------------- */
export interface BaseControllerOptions<Model> {
  prefix: string;
  swagger: { tags: string[] };
  service: BaseService<any>;
  createSchema: any;
  updateSchema: any;
  responseSchema: any;
  primaryKey?: string;
  extend?: (app: Elysia) => void;
  excludeRoutes?: (
    | "getAll"
    | "getOne"
    | "create"
    | "update"
    | "delete"
    | "deleteAll"
    | "count"
  )[];

  scope?: boolean; // ⭐ فقط true/false
}

/* ---------------------------------- */
/* Base Controller */
/* ---------------------------------- */
export class BaseController<Model extends Record<string, any>> {
  readonly app: Elysia;

  constructor({
    prefix,
    service,
    createSchema,
    updateSchema,
    responseSchema,
    swagger,
    extend,
    excludeRoutes = [],
    primaryKey = "id",
    scope = false,
  }: BaseControllerOptions<Model>) {
    const { tags } = swagger;
    const app = new Elysia({ prefix });

    const isEnabled = (route: string) => !excludeRoutes.includes(route as any);

    /* ---------------------------------- */
    /* GET ALL */
    /* ---------------------------------- */
    if (isEnabled("getAll")) {
      app.get(
        "/",
        async ({ query, headers, ...ctx }) => {
          const {
            page = 1,
            perPage = 20,
            sort,
            filter,
            include,
            select,
            paginate = false,
          } = query;

          let parsedFilter: Record<string, any> = {};
          let parsedInclude: Record<string, any> = {};
          let parsedSelect: Record<string, any> = {};

          if (filter) parsedFilter = JSON.parse(filter);
          if (include) parsedInclude = JSON.parse(include);
          if (select) parsedSelect = JSON.parse(select);

          parsedFilter = await applyScope({
            filter: parsedFilter,
            headers,
            ctx,
            enabled: scope,
          });

          const sortObj = parseSortString(sort);
          const usePagination = !!paginate;

          return await service.findAll({
            where: parsedFilter,
            orderBy: sortObj,
            include: parsedInclude,
            select: parsedSelect,
            page: usePagination ? Number(page) : 1,
            perPage: usePagination ? Number(perPage) : Number.MAX_SAFE_INTEGER,
          });
        },
        {
          tags,
          detail: { summary: "Get all" },
          query: querySchema,
          response: t.Object({
            items: t.Array(responseSchema),
            total: t.Integer(),
            page: t.Integer(),
            perPage: t.Integer(),
            totalPages: t.Integer(),
          }),
        },
      );
    }

    /* ---------------------------------- */
    /* GET ONE */
    /* ---------------------------------- */
    if (isEnabled("getOne")) {
      app.get(
        `/:${primaryKey}`,
        async ({ params, query, headers, ...ctx }) => {
          let parsedInclude: Record<string, any> = {};
          let parsedSelect: Record<string, any> = {};

          if (query.include) parsedInclude = JSON.parse(query.include);
          if (query.select) parsedSelect = JSON.parse(query.select);

          const keyValue = params[primaryKey];

          let where: any = {
            [primaryKey]: isNaN(Number(keyValue)) ? keyValue : Number(keyValue),
          };

          where = await applyScope({
            filter: where,
            headers,
            ctx,
            enabled: scope,
          });

          return await service.findOne(where, parsedInclude, parsedSelect);
        },
        {
          tags,
          detail: { summary: "Get one" },
          params: t.Object({
            [primaryKey]: t.Union([t.String(), t.Number()]),
          }),
          query: t.Object({
            include: t.Optional(t.String()),
            select: t.Optional(t.String()),
          }),
          response: responseSchema,
        },
      );
    }

    /* ---------------------------------- */
    /* CREATE */
    /* ---------------------------------- */
    if (isEnabled("create")) {
      app.post(
        "/",
        async ({ body, headers, ...ctx }) => {
          let data = body;

          if (scope) {
            const scoped = await applyScope({
              filter: {},
              headers,
              ctx,
              enabled: true,
            });

            data = {
              ...(body as any),
              ...scoped,
            };
          }

          return await service.create(data);
        },
        {
          tags,
          detail: { summary: "Create" },
          body: createSchema,
          response: responseSchema,
        },
      );
    }

    /* ---------------------------------- */
    /* UPDATE */
    /* ---------------------------------- */
    if (isEnabled("update")) {
      app.put(
        `/:${primaryKey}`,
        async ({ params, body, query, headers, ...ctx }) => {
          let parsedInclude: Record<string, any> = {};
          let parsedSelect: Record<string, any> = {};

          if (query.include) parsedInclude = JSON.parse(query.include);
          if (query.select) parsedSelect = JSON.parse(query.select);

          const keyValue = params[primaryKey];

          let where: any = {
            [primaryKey]: isNaN(Number(keyValue)) ? keyValue : Number(keyValue),
          };

          where = await applyScope({
            filter: where,
            headers,
            ctx,
            enabled: scope,
          });

          return await service.update(where, body, parsedInclude, parsedSelect);
        },
        {
          tags,
          detail: { summary: "Update" },
          validate: false,
          params: t.Object({
            [primaryKey]: t.Union([t.String(), t.Number()]),
          }),
          body: updateSchema,
          query: t.Object({
            include: t.Optional(t.String()),
            select: t.Optional(t.String()),
          }),
          response: responseSchema,
        },
      );
    }

    /* ---------------------------------- */
    /* DELETE */
    /* ---------------------------------- */
    if (isEnabled("delete")) {
      app.delete(
        `/:${primaryKey}`,
        async ({ params, query, headers, ...ctx }) => {
          const keyValue = params[primaryKey];

          let where: any = {
            [primaryKey]: isNaN(Number(keyValue)) ? keyValue : Number(keyValue),
          };

          where = await applyScope({
            filter: where,
            headers,
            ctx,
            enabled: scope,
          });

          return await service.delete(where, {
            force: query.force,
          });
        },
        {
          tags,
          detail: { summary: "Delete one" },
          params: t.Object({
            [primaryKey]: t.Union([t.String(), t.Number()]),
          }),
          query: t.Object({
            force: t.Optional(t.Boolean()),
          }),
          response: responseSchema,
        },
      );
    }

    /* ---------------------------------- */
    /* DELETE ALL */
    /* ---------------------------------- */
    if (isEnabled("deleteAll")) {
      app.delete(
        "/",
        async ({ query, headers, ...ctx }) => {
          let parsedFilter: Record<string, any> = {};

          if (query.filter) parsedFilter = JSON.parse(query.filter);

          parsedFilter = await applyScope({
            filter: parsedFilter,
            headers,
            ctx,
            enabled: scope,
          });

          const result = await service.deleteAll(parsedFilter, {
            force: query.force,
          });

          return {
            deleted: result.count ?? result.deleted ?? 0,
          };
        },
        {
          tags,
          detail: { summary: "Delete all" },
          query: querySchema,
          response: t.Object({
            deleted: t.Integer(),
          }),
        },
      );
    }

    /* ---------------------------------- */
    /* COUNT */
    /* ---------------------------------- */
    if (isEnabled("count")) {
      app.get(
        "/count",
        async ({ query, headers, ...ctx }) => {
          let parsedFilter: Record<string, any> = {};

          if (query.filter) parsedFilter = JSON.parse(query.filter);

          parsedFilter = await applyScope({
            filter: parsedFilter,
            headers,
            ctx,
            enabled: scope,
          });

          const result = await service.count(parsedFilter);

          return { count: result };
        },
        {
          tags,
          detail: { summary: "Count" },
          query: querySchema,
          response: t.Object({
            count: t.Integer(),
          }),
        },
      );
    }

    if (extend) extend(app as any);

    this.app = app as any;
  }
}
