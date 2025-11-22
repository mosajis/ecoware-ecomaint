import { BaseController } from "@/utils/base.controller";
import { BaseService } from "@/utils/base.service";
import { PrismaClient } from "orm/generated/prisma";
import {
  TblCompTypeJobMeasurePoint,
  TblCompTypeJobMeasurePointInputCreate,
  TblCompTypeJobMeasurePointInputUpdate,
  TblCompTypeJobMeasurePointPlain,
} from "orm/generated/prismabox/TblCompTypeJobMeasurePoint";
import { buildResponseSchema } from "@/utils/base.schema";
import { prisma } from "@/utils/prisma";

export const ServiceTblCompTypeJobMeasurePoint = new BaseService(prisma.tblCompTypeJobMeasurePoint);

const ControllerTblCompTypeJobMeasurePoint = new BaseController({
  prefix: "/tblCompTypeJobMeasurePoint",
  swagger: {
    tags: ["tblCompTypeJobMeasurePoint"],
  },
  primaryKey: "compTypeJobMeasurePointId",
  service: ServiceTblCompTypeJobMeasurePoint,
  createSchema: TblCompTypeJobMeasurePointInputCreate,
  updateSchema: TblCompTypeJobMeasurePointInputUpdate,
  responseSchema: buildResponseSchema(TblCompTypeJobMeasurePointPlain, TblCompTypeJobMeasurePoint),
}).app;

export default ControllerTblCompTypeJobMeasurePoint
