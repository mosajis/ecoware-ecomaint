import { t } from "elysia";
import { BaseController } from "@/utils/base.controller";
import { BaseService } from "@/utils/base.service";
import { buildResponseSchema } from "@/utils/base.schema";
import { prisma } from "@/utils/prisma";
import { effectComponentUnitChange } from "../effects/EffectTblComponentUnit";
import {
  TblComponentUnit,
  TblComponentUnitInputCreate,
  TblComponentUnitInputUpdate,
  TblComponentUnitPlain,
} from "orm/generated/prismabox/TblComponentUnit";
import { authPlugin } from "../auth/auth.guard";

export const ServiceTblComponentUnit = new BaseService(prisma.tblComponentUnit);

const ControllerTblComponentUnit = new BaseController({
  prefix: "/tblComponentUnit",
  swagger: {
    tags: ["tblComponentUnit"],
  },
  scope: true,
  primaryKey: "compId",
  service: ServiceTblComponentUnit,
  createSchema: TblComponentUnitInputCreate,
  updateSchema: TblComponentUnitInputUpdate,
  responseSchema: buildResponseSchema(TblComponentUnitPlain, TblComponentUnit),
  extend: (app) => {
    app.use(authPlugin).post(
      "/:componentUnitId/effect",
      async ({ params, body, set, userId, headers }) => {
        const instId = Number(headers["x-inst-id"] || 0);

        if (!instId) {
          throw new Error("Instance ID is required");
        }

        const componentUnitId = Number(params.componentUnitId);

        const user = await prisma.tblUser.findFirst({
          where: { userId },
          include: { tblEmployee: true },
        });
        const employeeId = user?.tblEmployee.employeeId as number;

        if (!Number.isInteger(componentUnitId)) {
          set.status = 400;
          return {
            status: "ERROR",
            message: "componentUnitId must be a valid number",
          };
        }

        try {
          await effectComponentUnitChange({
            componentUnitId,
            employeeId,
            instId,
          });

          return { status: "OK" };
        } catch (err) {
          set.status = 500;
          return {
            status: "ERROR",
            message:
              err instanceof Error ? err.message : "Unexpected server error",
          };
        }
      },
      {
        tags: ["tblComponentUnit"],
        detail: {
          summary: "Apply Component Unit Change Effect",
        },
        params: t.Object({
          componentUnitId: t.Numeric(),
        }),
        body: t.Object({
          userId: t.Number(),
        }),
      },
    );
  },
}).app;

export default ControllerTblComponentUnit;
