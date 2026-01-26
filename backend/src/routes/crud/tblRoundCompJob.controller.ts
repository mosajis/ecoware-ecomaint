import { BaseController } from "@/utils/base.controller";
import { BaseService } from "@/utils/base.service";

import {
  TblRoundCompJob,
  TblRoundCompJobInputCreate,
  TblRoundCompJobInputUpdate,
  TblRoundCompJobPlain,
} from "orm/generated/prismabox/TblRoundCompJob";
import { buildResponseSchema } from "@/utils/base.schema";
import { prisma } from "@/utils/prisma";

export const ServiceTblRoundCompJob = new BaseService(prisma.tblRoundCompJob);

const ControllerTblRoundCompJob = new BaseController({
  prefix: "/tblRoundCompJob",
  swagger: {
    tags: ["tblRoundCompJob"],
  },
  primaryKey: "roundCompJobId",
  service: ServiceTblRoundCompJob,
  createSchema: TblRoundCompJobInputCreate,
  updateSchema: TblRoundCompJobInputUpdate,
  responseSchema: buildResponseSchema(TblRoundCompJobPlain, TblRoundCompJob),
}).app;

export default ControllerTblRoundCompJob;
