import { BaseController } from "@/utils/base.controller";
import { BaseService } from "@/utils/base.service";

import {
  TblCompJob,
  TblCompJobInputCreate,
  TblCompJobInputUpdate,
  TblCompJobPlain,
} from "orm/generated/prismabox/TblCompJob";
import { buildResponseSchema } from "@/utils/base.schema";
import { prisma } from "@/utils/prisma";

export const ServiceTblCompJob = new BaseService(prisma.tblCompJob);

const ControllerTblCompJob = new BaseController({
  prefix: "/tblCompJob",
  swagger: {
    tags: ["tblCompJob"],
  },
  primaryKey: "compJobId",
  service: ServiceTblCompJob,
  createSchema: TblCompJobInputCreate,
  updateSchema: TblCompJobInputUpdate,
  responseSchema: buildResponseSchema(TblCompJobPlain, TblCompJob),
}).app;

export default ControllerTblCompJob;
