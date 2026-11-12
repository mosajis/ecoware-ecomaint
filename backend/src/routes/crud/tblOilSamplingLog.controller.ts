import { t } from "elysia";

import { BaseController } from "@/utils/base.controller";
import { BaseService } from "@/utils/base.service";
import { buildResponseSchema } from "@/utils/base.schema";
import { prisma } from "@/utils/prisma";

import {
  TblOilSamplingLog,
  TblOilSamplingLogInputCreate,
  TblOilSamplingLogInputUpdate,
  TblOilSamplingLogPlain,
} from "orm/generated/prismabox/TblOilSamplingLog";
import { authPlugin } from "../auth/auth.guard";

/* -------------------------------------------------------------------------- */
/* Service                                                                    */
/* -------------------------------------------------------------------------- */

export const ServiceTblOilSamplingLog = new BaseService(
  prisma.tblOilSamplingLog,
);

/* -------------------------------------------------------------------------- */
/* Context Schema                                                             */
/* -------------------------------------------------------------------------- */

const OilSamplingLogContextResponse = t.Object({
  maintLogId: t.Number(),

  component: t.Nullable(
    t.Object({
      compId: t.Number(),
      compNo: t.Nullable(t.String()),
    }),
  ),

  compOilInfoId: t.Number(),

  defaults: t.Object({
    compCounterVal: t.Number(),
    oilCounterVal: t.Number(),

    tankCapacity: t.Nullable(t.Number()),
    samplingPosition: t.Nullable(t.String()),
    laboratoryCode: t.Nullable(t.String()),
    oilDesc: t.Nullable(t.String()),

    orderNo: t.Nullable(t.Number()),

    changeOilDate: t.Nullable(t.String()),
    addOilVal: t.Nullable(t.Number()),

    lastSamplingDate: t.Nullable(t.String()),
    samplerId: t.Nullable(t.Number()),
  }),
});

/* -------------------------------------------------------------------------- */
/* Controller                                                                 */
/* -------------------------------------------------------------------------- */

const ControllerTblOilSamplingLog = new BaseController({
  prefix: "/tblOilSamplingLog",

  swagger: {
    tags: ["tblOilSamplingLog"],
  },

  primaryKey: "oilSamplingLogId",

  service: ServiceTblOilSamplingLog,

  createSchema: TblOilSamplingLogInputCreate,
  updateSchema: TblOilSamplingLogInputUpdate,

  scope: true,

  responseSchema: buildResponseSchema(
    TblOilSamplingLogPlain,
    TblOilSamplingLog,
  ),

  extend: (app) =>
    app.use(authPlugin).get(
      "/context",
      async ({ query, set }) => {
        const { maintLogId } = query;

        if (!maintLogId) {
          set.status = 400;

          return {
            message: "Maintenance log ID is required.",
          };
        }

        /* ------------------------------------------------------------------ */
        /* 1. Get Maintenance Log                                             */
        /* ------------------------------------------------------------------ */

        const maintLog = await prisma.tblMaintLog.findUnique({
          where: {
            maintLogId,
          },
          select: {
            maintLogId: true,
            tblComponentUnit: {
              select: {
                compId: true,
                compNo: true,
              },
            },
          },
        });

        const component = maintLog?.tblComponentUnit;
        const compId = component?.compId;

        if (!maintLog) {
          set.status = 404;

          return {
            message: "Maintenance log not found.",
          };
        }

        if (!compId) {
          set.status = 400;

          return {
            message: "Maintenance log does not have a component.",
          };
        }

        /* ------------------------------------------------------------------ */
        /* 3. Get Component Oil Information                                   */
        /* ------------------------------------------------------------------ */

        const compOilInfo = await prisma.tblCompOilInfo.findFirst({
          where: {
            compId,
          },
          orderBy: [
            {
              lastUpdate: "desc",
            },
            {
              compOilInfoId: "desc",
            },
          ],
          select: {
            compOilInfoId: true,
            tankCapacity: true,
            laboratoryCode: true,
            samplingPosition: true,
            oilDesc: true,
            orderNo: true,
          },
        });

        if (!compOilInfo) {
          set.status = 404;

          return {
            message: "Component oil information not found.",
          };
        }

        const compOilInfoId = compOilInfo.compOilInfoId;

        /* ------------------------------------------------------------------ */
        /* 4. Get Latest Component Counter                                    */
        /* ------------------------------------------------------------------ */

        const compCounter = await prisma.tblCompCounter.findFirst({
          where: {
            compId,
          },
          orderBy: [
            {
              lastUpdate: "desc",
            },
            {
              compCounterId: "desc",
            },
          ],
          select: {
            currentValue: true,
          },
        });

        /* ------------------------------------------------------------------ */
        /* 5. Get Latest Oil Sampling Log                                     */
        /* ------------------------------------------------------------------ */

        const lastSampling = await prisma.tblOilSamplingLog.findFirst({
          where: {
            compOilInfoId,
          },
          orderBy: [
            {
              samplingdate: "desc",
            },
            {
              oilSamplingLogId: "desc",
            },
          ],
          select: {
            oilCounterVal: true,
            changeOilDate: true,
            addOilVal: true,
            samplingdate: true,
            tankCapacity: true,
            samplingPosition: true,
            laboratoryCode: true,
            oilDesc: true,
            orderNo: true,
            samplerId: true,
          },
        });

        /* ------------------------------------------------------------------ */
        /* 6. Build Context                                                   */
        /* ------------------------------------------------------------------ */

        return {
          maintLogId,

          component: component
            ? {
                compId: component.compId,
                compNo: component.compNo,
              }
            : null,

          compOilInfoId,

          defaults: {
            // Directly from the latest TblCompCounter record.
            compCounterVal: compCounter?.currentValue ?? 0,

            // Previous sampling values are used when available.
            oilCounterVal: lastSampling?.oilCounterVal ?? 0,

            tankCapacity:
              lastSampling?.tankCapacity ?? compOilInfo.tankCapacity,

            samplingPosition:
              lastSampling?.samplingPosition ?? compOilInfo.samplingPosition,

            laboratoryCode:
              lastSampling?.laboratoryCode ?? compOilInfo.laboratoryCode,

            oilDesc: lastSampling?.oilDesc ?? compOilInfo.oilDesc,

            orderNo: lastSampling?.orderNo ?? compOilInfo.orderNo,

            changeOilDate: lastSampling?.changeOilDate?.toISOString() ?? null,

            addOilVal: lastSampling?.addOilVal ?? null,

            lastSamplingDate: lastSampling?.samplingdate.toISOString() ?? null,

            samplerId: lastSampling?.samplerId ?? null,
          },
        };
      },
      {
        query: t.Object({
          maintLogId: t.Numeric(),
        }),

        response: {
          200: OilSamplingLogContextResponse,

          400: t.Object({
            message: t.String(),
          }),

          404: t.Object({
            message: t.String(),
          }),
        },

        detail: {
          summary: "Get oil sampling log context",
          description:
            "Returns component information and default values for creating an oil sampling log.",
        },
      },
    ),
}).app;

export default ControllerTblOilSamplingLog;
