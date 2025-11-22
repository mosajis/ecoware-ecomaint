import { BaseController } from "@/utils/base.controller";
import { BaseService } from "@/utils/base.service";
import { PrismaClient } from "orm/generated/prisma";
import {
  TblCompMeasurePoint,
  TblCompMeasurePointInputCreate,
  TblCompMeasurePointInputUpdate,
  TblCompMeasurePointPlain,
} from "orm/generated/prismabox/TblCompMeasurePoint";
import { buildResponseSchema } from "@/utils/base.schema";
import { prisma } from "@/utils/prisma";

export const ServiceTblCompMeasurePoint = new BaseService(prisma.tblCompMeasurePoint);

const ControllerTblCompMeasurePoint = new BaseController({
  prefix: "/tblCompMeasurePoint",
  swagger: {
    tags: ["tblCompMeasurePoint"],
  },
  primaryKey: "compMeasurePointId",
  service: ServiceTblCompMeasurePoint,
  createSchema: TblCompMeasurePointInputCreate,
  updateSchema: TblCompMeasurePointInputUpdate,
  responseSchema: buildResponseSchema(TblCompMeasurePointPlain, TblCompMeasurePoint),
}).app;

export default ControllerTblCompMeasurePoint
