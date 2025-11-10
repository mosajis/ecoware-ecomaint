import { BaseController } from "@/utils/base.controller";
import { BaseService } from "@/utils/base.service";
import { PrismaClient } from "orm/generated/prisma";
import {
  TblCompJobMeasurePoint,
  TblCompJobMeasurePointInputCreate,
  TblCompJobMeasurePointInputUpdate,
  TblCompJobMeasurePointPlain,
} from "orm/generated/prismabox/TblCompJobMeasurePoint";
import { buildResponseSchema } from "@/utils/base.schema";
import { prisma } from "@/utils/prisma";

export const ServiceTblCompJobMeasurePoint = new BaseService(prisma.tblCompJobMeasurePoint);

const ControllerTblCompJobMeasurePoint = new BaseController({
  prefix: "/tblCompJobMeasurePoint",
  swagger: {
    tags: ["tblCompJobMeasurePoint"],
  },
  service: ServiceTblCompJobMeasurePoint,
  createSchema: TblCompJobMeasurePointInputCreate,
  updateSchema: TblCompJobMeasurePointInputUpdate,
  responseSchema: buildResponseSchema(TblCompJobMeasurePointPlain, TblCompJobMeasurePoint),
}).app;

export default ControllerTblCompJobMeasurePoint
