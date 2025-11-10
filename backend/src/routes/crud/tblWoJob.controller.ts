import { BaseController } from "@/utils/base.controller";
import { BaseService } from "@/utils/base.service";
import { PrismaClient } from "orm/generated/prisma";
import {
  TblWoJob,
  TblWoJobInputCreate,
  TblWoJobInputUpdate,
  TblWoJobPlain,
} from "orm/generated/prismabox/TblWoJob";
import { buildResponseSchema } from "@/utils/base.schema";
import { prisma } from "@/utils/prisma";

export const ServiceTblWoJob = new BaseService(prisma.tblWoJob);

const ControllerTblWoJob = new BaseController({
  prefix: "/tblWoJob",
  swagger: {
    tags: ["tblWoJob"],
  },
  service: ServiceTblWoJob,
  createSchema: TblWoJobInputCreate,
  updateSchema: TblWoJobInputUpdate,
  responseSchema: buildResponseSchema(TblWoJobPlain, TblWoJob),
}).app;

export default ControllerTblWoJob
