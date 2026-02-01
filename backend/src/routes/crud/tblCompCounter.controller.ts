import { t } from "elysia";
import { BaseController } from "@/utils/base.controller";
import { buildResponseSchema } from "@/utils/base.schema";
import { prisma } from "@/utils/prisma";
import { effectCompCounter } from "../effects/EffectTblCompCounter";
import { BaseService } from "@/utils/base.service";
import {
  TblCompCounter,
  TblCompCounterInputCreate,
  TblCompCounterInputUpdate,
  TblCompCounterPlain,
} from "orm/generated/prismabox/TblCompCounter";

export const ServiceTblCompCounter = new BaseService(prisma.tblCompCounter);
const ControllerTblCompCounter = new BaseController({
  prefix: "/tblCompCounter",
  swagger: {
    tags: ["tblCompCounter"],
  },
  primaryKey: "compCounterId",
  service: ServiceTblCompCounter,
  createSchema: TblCompCounterInputCreate,
  updateSchema: TblCompCounterInputUpdate,
  responseSchema: buildResponseSchema(TblCompCounterPlain, TblCompCounter),
  extend: (app) => {
    app.post(
      "/",
      async ({ body, set }) => {
        const data = body;
        const result = await prisma.$transaction(async (tx) => {
          const counter = await tx.tblCompCounter.create({
            data: {
              compId: data.tblComponentUnit?.connect.compId,
              averageCountRate: data.averageCountRate,
              counterTypeId: data.tblCounterType?.connect.counterTypeId,
              dependsOnId: data.tblCompCounter?.connect.compCounterId,
              orderNo: data.orderNo,
              startDate: data.startDate,
              startValue: data.startValue,
              useCalcAverage: data.useCalcAverage,
              zeroedDate: null,
              changedBy: null,
              currentDate: null,
              currentValue: null,
              lastupdate: null,
              lastZeroedValue: null,
              deptId: 0,
              exportMarker: 0,
            },
          });
          await effectCompCounter(tx, counter);
          return counter;
        });

        set.status = 201;
        return result;
      },
      {
        tags: ["tblCompCounter"],
        detail: {
          summary: "Create",
          description:
            "Create TblCompCounter and run side effects in transaction",
        },
        body: TblCompCounterInputCreate,
        response: buildResponseSchema(TblCompCounterPlain, TblCompCounter),
      },
    );

    app.put(
      "/:compCounterId",
      async ({ params, body }) => {
        const compCounterId = Number(params.compCounterId);
        const data = body;

        const result = await prisma.$transaction(async (tx) => {
          const counter = await tx.tblCompCounter.update({
            where: { compCounterId },
            data: {
              averageCountRate: data.averageCountRate,
              dependsOnId: data.tblCompCounter?.connect?.compCounterId,
              orderNo: data.orderNo,
              startDate: data.startDate,
              startValue: data.startValue,
              currentDate: data.currentDate,
              currentValue: data.currentValue,
              useCalcAverage: data.useCalcAverage,
            },
          });
          await effectCompCounter(tx, counter);
          return counter;
        });

        return result;
      },
      {
        tags: ["tblCompCounter"],
        detail: {
          summary: "Update",
          description:
            "Update TblCompCounter and run side effects in transaction",
        },
        params: t.Object({
          compCounterId: t.Number(),
        }),
        body: TblCompCounterInputUpdate,
        response: buildResponseSchema(TblCompCounterPlain, TblCompCounter),
      },
    );
  },
}).app;

export default ControllerTblCompCounter;
