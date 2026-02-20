// base.controller.ts
import { Elysia, t } from "elysia";
import { BaseService } from "./base.service";

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
}

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
  }: BaseControllerOptions<Model>) {
    const { tags } = swagger;
    const app = new Elysia({ prefix });

    const isEnabled = (route: string) => !excludeRoutes.includes(route as any);

    // 🧩 GET / (Get All)
    if (isEnabled("getAll")) {
      app.get(
        "/",
        async ({ query }) => {
          const {
            page = 1,
            perPage = 20,
            sort,
            filter,
            include,
            select, // 🆕
            paginate = false,
          } = query;

          let parsedFilter: Record<string, any> = {};
          let parsedInclude: Record<string, any> = {};
          let parsedSelect: Record<string, any> = {}; // 🆕

          if (filter) {
            try {
              parsedFilter = JSON.parse(filter);
            } catch {
              throw new Error("Invalid filter JSON");
            }
          }

          if (include) {
            try {
              parsedInclude = JSON.parse(include);
            } catch {
              throw new Error("Invalid include JSON");
            }
          }

          // 🆕 پارس select
          if (select) {
            try {
              parsedSelect = JSON.parse(select);
            } catch {
              throw new Error("Invalid select JSON");
            }
          }

          const sortObj = parseSortString(sort);
          const usePagination = !!paginate;

          return await service.findAll({
            where: parsedFilter,
            orderBy: sortObj,
            include: parsedInclude,
            select: parsedSelect, // 🆕
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

    // 🧩 GET /:primaryKey (Get One)
    if (isEnabled("getOne")) {
      app.get(
        `/:${primaryKey}`,
        async ({ params, query }) => {
          let parsedInclude: Record<string, any> = {};
          let parsedSelect: Record<string, any> = {}; // 🆕

          if (query.include) {
            try {
              parsedInclude = JSON.parse(query.include);
            } catch {
              throw new Error("Invalid include JSON");
            }
          }

          // 🆕 پارس select
          if (query.select) {
            try {
              parsedSelect = JSON.parse(query.select);
            } catch {
              throw new Error("Invalid select JSON");
            }
          }

          const keyValue = params[primaryKey];
          return await service.findOne(
            {
              [primaryKey]: isNaN(Number(keyValue))
                ? keyValue
                : Number(keyValue),
            },
            parsedInclude,
            parsedSelect, // 🆕
          );
        },
        {
          tags,
          detail: { summary: "Get one" },
          params: t.Object({ [primaryKey]: t.Union([t.String(), t.Number()]) }),
          query: t.Object({
            include: t.Optional(t.String()),
            select: t.Optional(t.String()), // 🆕
          }),
          response: responseSchema,
        },
      );
    }

    // 🧩 POST / (Create)
    if (isEnabled("create")) {
      app.post(
        "/",
        async ({ body }) => {
          return await service.create(body);
        },
        {
          tags,
          detail: { summary: "Create" },
          body: createSchema,
          response: responseSchema,
        },
      );
    }

    // 🧩 PUT /:primaryKey (Update)
    if (isEnabled("update")) {
      app.put(
        `/:${primaryKey}`,
        async ({ params, body, query }) => {
          let parsedInclude: Record<string, any> = {};
          let parsedSelect: Record<string, any> = {}; // 🆕

          if (query.include) {
            try {
              parsedInclude = JSON.parse(query.include);
            } catch {
              throw new Error("Invalid include JSON");
            }
          }

          // 🆕 پارس select
          if (query.select) {
            try {
              parsedSelect = JSON.parse(query.select);
            } catch {
              throw new Error("Invalid select JSON");
            }
          }

          const keyValue = params[primaryKey];
          return await service.update(
            {
              [primaryKey]: isNaN(Number(keyValue))
                ? keyValue
                : Number(keyValue),
            },
            body,
            parsedInclude,
            parsedSelect, // 🆕
          );
        },
        {
          tags,
          detail: { summary: "Update" },
          validate: false,
          params: t.Object({ [primaryKey]: t.Union([t.String(), t.Number()]) }),
          body: updateSchema,
          query: t.Object({
            include: t.Optional(t.String()),
            select: t.Optional(t.String()), // 🆕
          }),
          response: responseSchema,
        },
      );
    }

    // 🧩 DELETE /:primaryKey (Soft or Force Delete)
    if (isEnabled("delete")) {
      app.delete(
        `/:${primaryKey}`,
        async ({ params, query }) => {
          const keyValue = params[primaryKey];
          return await service.delete(
            {
              [primaryKey]: isNaN(Number(keyValue))
                ? keyValue
                : Number(keyValue),
            },
            { force: query.force },
          );
        },
        {
          tags,
          detail: { summary: "Delete one" },
          params: t.Object({ [primaryKey]: t.Union([t.String(), t.Number()]) }),
          query: t.Object({ force: t.Optional(t.Boolean()) }),
          response: responseSchema,
        },
      );
    }

    // 🧩 DELETE / (Delete All)
    if (isEnabled("deleteAll")) {
      app.delete(
        "/",
        async ({ query }) => {
          let parsedFilter: Record<string, any> = {};
          if (query.filter) {
            try {
              parsedFilter = JSON.parse(query.filter);
            } catch {
              throw new Error("Invalid filter JSON");
            }
          }
          const result = await service.deleteAll(parsedFilter, {
            force: query.force,
          });
          return { deleted: result.count ?? result.deleted ?? 0 };
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

    // 🧩 GET /count
    if (isEnabled("count")) {
      app.get(
        "/count",
        async ({ query }) => {
          let parsedFilter: Record<string, any> = {};
          if (query.filter) {
            try {
              parsedFilter = JSON.parse(query.filter);
            } catch {
              throw new Error("Invalid filter JSON");
            }
          }
          const result = await service.count(parsedFilter);
          return { count: result };
        },
        {
          tags,
          detail: { summary: "Count" },
          query: querySchema,
          response: t.Object({ count: t.Integer() }),
        },
      );
    }

    // 🧩 Extend custom routes
    if (extend) extend(app as any);

    this.app = app as any;
  }
}
