import { BaseController, querySchema } from "@/utils/base.controller";
import { BaseService } from "@/utils/base.service";
import { t } from "elysia";
import { buildResponseSchema } from "@/utils/base.schema";
import { prisma } from "@/utils/prisma";
import {
  TblMaintLogSpare,
  TblMaintLogSpareInputCreate,
  TblMaintLogSpareInputUpdate,
  TblMaintLogSparePlain,
} from "orm/generated/prismabox/TblMaintLogSpare";

export const ServiceTblMaintLogSpare = new BaseService(prisma.tblMaintLogSpare);

const responseSchema = buildResponseSchema(
  TblMaintLogSparePlain,
  TblMaintLogSpare,
);

const MaintLogStockWithTotalsSchema = t.Object({
  maintLogStockId: t.Number(),
  spareItemId: t.Number(),
  spareCount: t.Union([t.Number(), t.Null()]),

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

const ControllerTblMaintLogSpare = new BaseController({
  prefix: "/tblMaintLogSpare",
  swagger: {
    tags: ["tblMaintLogSpare"],
  },
  primaryKey: "maintLogSpareId",
  scope: true,
  service: ServiceTblMaintLogSpare,
  createSchema: TblMaintLogSpareInputCreate,
  updateSchema: TblMaintLogSpareInputUpdate,
  responseSchema,
  extend: (app) => {
    app.get(
      "/uniqueSpareUnit",
      async ({ query }) => {
        const compId = Number(query.compId) ?? null;

        const page = query.page ?? 1;
        const perPage = query.perPage ?? 20;
        const paginate = query.paginate !== false;

        const skip = (page - 1) * perPage;

        // 1) گرفتن stockItemId یکتا با groupBy
        const distinctIds = await prisma.tblMaintLogSpare.groupBy({
          by: ["spareUnitId"],
          orderBy: { spareUnitId: "asc" },
          skip: paginate ? skip : undefined,
          take: paginate ? perPage : undefined,
        });

        const stockItemIds = distinctIds.map((d) => d.spareUnitId);

        // 2) گرفتن رکوردهای maintLogSpare مربوط به stockItemId های یکتا
        const records = await prisma.tblMaintLogSpare.findMany({
          where: {
            spareUnitId: { in: stockItemIds },
            tblMaintLog: { compId: compId },
          },
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
            prisma.tblMaintLogSpare.aggregate({
              where: { spareUnitId: id },
              _sum: { spareCount: true },
              _count: { spareUnitId: true },
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
            totalCount: a?._count?.spareUnitId ?? 0,
            totalUse: a?._sum?.spareCount ?? 0,
          });
        });

        // 5) آماده‌سازی خروجی (اضافه کردن totalCount و totalUse به هر رکورد)
        const items = records.map((r) => {
          const agg = aggregateMap.get(r.spareUnitId) ?? {
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
        const total = await prisma.tblMaintLogSpare.groupBy({
          by: ["spareUnitId"],
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
        tags: ["tblMaintLogSpare"],
        detail: {
          summary: "Get unique spare units by stockItemId",
        },
        query: t.Object({
          compId: t.Optional(t.Number()),
          page: t.Optional(t.Number()),
          perPage: t.Optional(t.Number()),
          sort: t.Optional(t.String()),
          filter: t.Optional(t.String()),
          include: t.Optional(t.String()),
          select: t.Optional(t.String()),
          paginate: t.Optional(t.Boolean()),
          force: t.Optional(t.Boolean()),
        }),
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

export default ControllerTblMaintLogSpare;
