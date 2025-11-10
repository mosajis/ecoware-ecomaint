// utils/base.controller.ts
import { Elysia, t } from "elysia";
import { type Static } from "@sinclair/typebox";
import { BaseService } from "./base.service";

const querySchema = t.Object({
  page: t.Optional(t.Number()),
  perPage: t.Optional(t.Number()),
  sort: t.Optional(t.String()),
  filter: t.Optional(t.String()),
  include: t.Optional(t.String()),
  paginate: t.Optional(t.Boolean()),
  force: t.Optional(t.Boolean()), // برای delete واقعی
});

type Query = Static<typeof querySchema>;

function parseSortString(sort?: string): Record<string, "asc" | "desc"> {
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
            paginate = true,
          } = query;

          let parsedFilter: Record<string, any> = {};
          let parsedInclude: Record<string, any> = {};

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

          const sortObj = parseSortString(sort);
          const usePagination = !!paginate;

          return await service.findAll({
            where: parsedFilter,
            orderBy: sortObj,
            include: parsedInclude,
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

    // 🧩 GET /:id (Get One)
    if (isEnabled("getOne")) {
      app.get(
        "/:id",
        async ({ params, query }) => {
          let parsedInclude: Record<string, any> = {};
          if (query.include) {
            try {
              parsedInclude = JSON.parse(query.include);
            } catch {
              throw new Error("Invalid include JSON");
            }
          }
          return await service.findOne(
            { id: Number(params.id) },
            parsedInclude,
          );
        },
        {
          tags,
          detail: { summary: "Get one" },
          params: t.Object({ id: t.Number() }),
          query: t.Object({
            include: t.Optional(t.String()),
          }),
          response: t.Union([responseSchema, t.Null()]),
        },
      );
    }

    // 🧩 POST / (Create)
    if (isEnabled("create")) {
      app.post("/", async ({ body }) => await service.create(body), {
        tags,
        detail: { summary: "Create" },
        body: createSchema,
        response: responseSchema,
      });
    }

    // 🧩 PUT /:id (Update)
    if (isEnabled("update")) {
      app.put(
        "/:id",
        async ({ params, body }) =>
          await service.update({ id: Number(params.id) }, body),
        {
          tags,
          detail: { summary: "Update" },
          params: t.Object({ id: t.Number() }),
          body: updateSchema,
          response: responseSchema,
        },
      );
    }

    // 🧩 DELETE /:id (Soft or Force Delete)
    if (isEnabled("delete")) {
      app.delete(
        "/:id",
        async ({ params, query }) =>
          await service.delete(
            { id: Number(params.id) },
            { force: query.force },
          ),
        {
          tags,
          detail: { summary: "Delete one" },
          params: t.Object({ id: t.Number() }),
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
