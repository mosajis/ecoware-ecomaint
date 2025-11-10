import { BaseController } from "@/utils/base.controller";
import { BaseService } from "@/utils/base.service";
import { PrismaClient } from "orm/generated/prisma";
import {
  TblCompTypeJob,
  TblCompTypeJobInputCreate,
  TblCompTypeJobInputUpdate,
  TblCompTypeJobPlain,
} from "orm/generated/prismabox/TblCompTypeJob";
import { buildResponseSchema } from "@/utils/base.schema";
import { prisma } from "@/utils/prisma";

export const ServiceTblCompTypeJob = new BaseService(prisma.tblCompTypeJob);

const ControllerTblCompTypeJob = new BaseController({
  prefix: "/tblCompTypeJob",
  swagger: {
    tags: ["tblCompTypeJob"],
  },
  service: ServiceTblCompTypeJob,
  createSchema: TblCompTypeJobInputCreate,
  updateSchema: TblCompTypeJobInputUpdate,
  responseSchema: buildResponseSchema(TblCompTypeJobPlain, TblCompTypeJob),
}).app;

export default ControllerTblCompTypeJob
