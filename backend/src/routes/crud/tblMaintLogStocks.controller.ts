import { BaseController, querySchema } from "@/utils/base.controller";
import { BaseService } from "@/utils/base.service";
import { t } from "elysia";
import { buildResponseSchema } from "@/utils/base.schema";
import { prisma } from "@/utils/prisma";
import {
  TblMaintLogStocks,
  TblMaintLogStocksInputCreate,
  TblMaintLogStocksInputUpdate,
  TblMaintLogStocksPlain,
} from "orm/generated/prismabox/TblMaintLogStocks";

export const ServiceTblMaintLogStocks = new BaseService(
  prisma.tblMaintLogStocks,
);

const responseSchema = buildResponseSchema(
  TblMaintLogStocksPlain,
  TblMaintLogStocks,
);

const MaintLogStockWithTotalsSchema = t.Object({
  maintLogStockId: t.Number(),
  stockItemId: t.Number(),
  stockCount: t.Union([t.Number(), t.Null()]),

  tblSpareUnit: t.Optional(
    t.Union([
      t.Null(),
      t.Object({
        spareUnitId: t.Number(),

        tblSpareType: t.Optional(
          t.Union([
            t.Null(),
            t.Object({
              spareTypeId: t.Number(),
              name: t.Union([t.String(), t.Null()]),

              tblUnit: t.Optional(
                t.Union([
                  t.Null(),
                  t.Object({
                    unitId: t.Number(),
                    name: t.Union([t.String(), t.Null()]),
                  }),
                ]),
              ),
            }),
          ]),
        ),
      }),
    ]),
  ),

  totalCount: t.Number(),
  totalUse: t.Number(),
});

const ControllerTblMaintLogStocks = new BaseController({
  prefix: "/tblMaintLogStocks",
  swagger: {
    tags: ["tblMaintLogStocks"],
  },
  primaryKey: "maintLogStockId",
  service: ServiceTblMaintLogStocks,
  createSchema: TblMaintLogStocksInputCreate,
  updateSchema: TblMaintLogStocksInputUpdate,
  responseSchema,
  extend: (app) => {
    app.get(
      "/uniqueSpareUnit",
      async ({ query }) => {
        const page = query.page ?? 1;
        const perPage = query.perPage ?? 20;
        const paginate = query.paginate !== false;

        const skip = (page - 1) * perPage;

        // 1) گرفتن stockItemId یکتا با groupBy
        const distinctIds = await prisma.tblMaintLogStocks.groupBy({
          by: ["stockItemId"],
          orderBy: { stockItemId: "asc" },
          skip: paginate ? skip : undefined,
          take: paginate ? perPage : undefined,
        });

        const stockItemIds = distinctIds.map((d) => d.stockItemId);

        // 2) گرفتن رکوردهای maintLogStocks مربوط به stockItemId های یکتا
        const records = await prisma.tblMaintLogStocks.findMany({
          where: { stockItemId: { in: stockItemIds } },
          include: {
            tblSpareUnit: {
              include: {
                tblSpareType: {
                  include: {
                    tblUnit: true,
                  },
                },
              },
            },
          },
        });

        // 3) aggregate برای هر stockItemId
        const aggregates = await Promise.all(
          stockItemIds.map((id) =>
            prisma.tblMaintLogStocks.aggregate({
              where: { stockItemId: id },
              _sum: { stockCount: true },
              _count: { stockItemId: true },
            }),
          ),
        );

        // 4) تبدیل aggregates به map برای دسترسی سریع
        const aggregateMap = new Map<
          number,
          { totalCount: number; totalUse: number }
        >();
        stockItemIds.forEach((id, idx) => {
          const a = aggregates[idx];

          aggregateMap.set(id, {
            totalCount: a?._count?.stockItemId ?? 0,
            totalUse: a?._sum?.stockCount ?? 0,
          });
        });

        // 5) آماده‌سازی خروجی (اضافه کردن totalCount و totalUse به هر رکورد)
        const items = records.map((r) => {
          const agg = aggregateMap.get(r.stockItemId) ?? {
            totalCount: 0,
            totalUse: 0,
          };
          return {
            ...r,
            totalCount: agg.totalCount ?? 0,
            totalUse: agg.totalUse,
          };
        });

        // 6) total گروه‌ها (تعداد stockItemId یکتا)
        const total = await prisma.tblMaintLogStocks.groupBy({
          by: ["stockItemId"],
        });

        const totalPages = paginate ? Math.ceil(total.length / perPage) : 1;

        return {
          items,
          total: total.length,
          page,
          perPage,
          totalPages,
        };
      },
      {
        tags: ["tblMaintLogStocks"],
        detail: {
          summary: "Get unique spare units by stockItemId",
        },
        query: querySchema,
        response: t.Object({
          items: t.Array(MaintLogStockWithTotalsSchema),
          total: t.Integer(),
          page: t.Integer(),
          perPage: t.Integer(),
          totalPages: t.Integer(),
        }),
      },
    );
  },
}).app;

export default ControllerTblMaintLogStocks;
