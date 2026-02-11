import {
  BaseController,
  parseSortString,
  querySchema,
} from "@/utils/base.controller";
import { BaseService } from "@/utils/base.service";
import {
  TblMaintLog,
  TblMaintLogInputCreate,
  TblMaintLogInputUpdate,
  TblMaintLogPlain,
} from "orm/generated/prismabox/TblMaintLog";
import { buildResponseSchema } from "@/utils/base.schema";
import { prisma } from "@/utils/prisma";
import { t } from "elysia";
import { periodToDays } from "@/helper";

/**
 * Item
 */
const MaintLogItemSchema = t.Object({
  maintLogId: t.Number(),

  dateDone: t.Optional(t.String()),
  downTime: t.Optional(t.String()),
  unplanned: t.Boolean(),

  tblComponentUnit: t.Optional(
    t.Object({
      compNo: t.String(),
    }),
  ),

  tblJobDescription: t.Optional(
    t.Object({
      jobDescCode: t.String(),
      jobDescTitle: t.String(),
    }),
  ),

  tblWorkOrder: t.Optional(
    t.Object({
      tblDiscipline: t.Optional(
        t.Object({
          name: t.String(),
        }),
      ),
    }),
  ),

  tblFollowStatus: t.Optional(
    t.Object({
      fsName: t.String(),
    }),
  ),

  tblMaintClass: t.Optional(
    t.Object({
      descr: t.Optional(t.String()),
    }),
  ),
});

/**
 * List Response
 */
export const MaintLogListResponseSchema = t.Object({
  data: t.Array(MaintLogItemSchema),
  total: t.Number(),
  page: t.Number(),
  perPage: t.Number(),
});

export const ServiceTblMaintLog = new BaseService(prisma.tblMaintLog);
const ControllerTblMaintLog = new BaseController({
  prefix: "/tblMaintLog",
  swagger: {
    tags: ["tblMaintLog"],
  },
  primaryKey: "maintLogId",
  service: ServiceTblMaintLog,
  createSchema: TblMaintLogInputCreate,
  updateSchema: TblMaintLogInputUpdate,
  responseSchema: buildResponseSchema(TblMaintLogPlain, TblMaintLog),

  extend: (app) => {
    app.get(
      "/",
      async ({ query }) => {
        const {
          page = 1,
          perPage = 20,
          sort,
          filter,
          paginate = false,
        } = query;

        const parsedFilter = filter ? JSON.parse(filter) : {};
        const sortObj = parseSortString(sort);
        const usePagination = !!paginate;

        return ServiceTblMaintLog.findAll({
          where: parsedFilter,
          orderBy: sortObj,
          page: usePagination ? Number(page) : 1,
          perPage: usePagination ? Number(perPage) : Number.MAX_SAFE_INTEGER,

          select: {
            maintLogId: true,
            dateDone: true,
            downTime: true,
            unexpected: true,

            tblComponentUnit: {
              select: {
                compNo: true,
              },
            },

            tblJobDescription: {
              select: {
                jobDescCode: true,
                jobDescTitle: true,
              },
            },

            tblWorkOrder: {
              select: {
                tblDiscipline: {
                  select: {
                    name: true,
                  },
                },
              },
            },

            tblFollowStatus: {
              select: {
                fsName: true,
              },
            },

            tblMaintClass: {
              select: {
                descr: true,
              },
            },
          },
        });
      },
      {
        tags: ["tblWorkOrder"],
        detail: { summary: "Get all with custom select" },
        query: querySchema,
        data: t.Array(MaintLogItemSchema),
      },
    );
  },
}).app;

export default ControllerTblMaintLog;
