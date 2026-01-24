import { BaseController } from "@/utils/base.controller";
import { BaseService } from "@/utils/base.service";
import { PrismaClient } from "orm/generated/prisma";
import {
  TblMaintLogFollow,
  TblMaintLogFollowInputCreate,
  TblMaintLogFollowInputUpdate,
  TblMaintLogFollowPlain,
} from "orm/generated/prismabox/TblMaintLogFollow";
import { buildResponseSchema } from "@/utils/base.schema";
import { prisma } from "@/utils/prisma";

export const ServiceTblMaintLogFollow = new BaseService(
  prisma.tblMaintLogFollow,
);

const ControllerTblMaintLogFollow = new BaseController({
  prefix: "/tblMaintLogFollow",
  swagger: {
    tags: ["tblMaintLogFollow"],
  },
  primaryKey: "followId",
  service: ServiceTblMaintLogFollow,
  createSchema: TblMaintLogFollowInputCreate,
  updateSchema: TblMaintLogFollowInputUpdate,
  responseSchema: buildResponseSchema(
    TblMaintLogFollowPlain,
    TblMaintLogFollow,
  ),
}).app;

export default ControllerTblMaintLogFollow;
