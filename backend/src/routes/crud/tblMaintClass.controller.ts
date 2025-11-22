import { BaseController } from "@/utils/base.controller";
import { BaseService } from "@/utils/base.service";
import { PrismaClient } from "orm/generated/prisma";
import {
  TblMaintClass,
  TblMaintClassInputCreate,
  TblMaintClassInputUpdate,
  TblMaintClassPlain,
} from "orm/generated/prismabox/TblMaintClass";
import { buildResponseSchema } from "@/utils/base.schema";
import { prisma } from "@/utils/prisma";

export const ServiceTblMaintClass = new BaseService(prisma.tblMaintClass);

const ControllerTblMaintClass = new BaseController({
  prefix: "/tblMaintClass",
  swagger: {
    tags: ["tblMaintClass"],
  },
  primaryKey: "maintClassId",
  service: ServiceTblMaintClass,
  createSchema: TblMaintClassInputCreate,
  updateSchema: TblMaintClassInputUpdate,
  responseSchema: buildResponseSchema(TblMaintClassPlain, TblMaintClass),
}).app;

export default ControllerTblMaintClass
