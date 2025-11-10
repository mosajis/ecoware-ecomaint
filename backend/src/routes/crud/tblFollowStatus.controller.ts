import { BaseController } from "@/utils/base.controller";
import { BaseService } from "@/utils/base.service";
import { PrismaClient } from "orm/generated/prisma";
import {
  TblFollowStatus,
  TblFollowStatusInputCreate,
  TblFollowStatusInputUpdate,
  TblFollowStatusPlain,
} from "orm/generated/prismabox/TblFollowStatus";
import { buildResponseSchema } from "@/utils/base.schema";
import { prisma } from "@/utils/prisma";

export const ServiceTblFollowStatus = new BaseService(prisma.tblFollowStatus);

const ControllerTblFollowStatus = new BaseController({
  prefix: "/tblFollowStatus",
  swagger: {
    tags: ["tblFollowStatus"],
  },
  service: ServiceTblFollowStatus,
  createSchema: TblFollowStatusInputCreate,
  updateSchema: TblFollowStatusInputUpdate,
  responseSchema: buildResponseSchema(TblFollowStatusPlain, TblFollowStatus),
}).app;

export default ControllerTblFollowStatus
