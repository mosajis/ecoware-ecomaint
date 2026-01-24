import { BaseController } from "@/utils/base.controller";
import { BaseService } from "@/utils/base.service";
import { PrismaClient } from "orm/generated/prisma";
import {
  TblFailureGroupFollow,
  TblFailureGroupFollowInputCreate,
  TblFailureGroupFollowInputUpdate,
  TblFailureGroupFollowPlain,
} from "orm/generated/prismabox/TblFailureGroupFollow";
import { buildResponseSchema } from "@/utils/base.schema";
import { prisma } from "@/utils/prisma";

export const ServiceTblFailureGroupFollow = new BaseService(
  prisma.tblFailureGroupFollow,
);

const ControllerTblFailureGroupFollow = new BaseController({
  prefix: "/tblFailureGroupFollow",
  swagger: {
    tags: ["tblFailureGroupFollow"],
  },
  primaryKey: "failureGroupFollowId",
  service: ServiceTblFailureGroupFollow,
  createSchema: TblFailureGroupFollowInputCreate,
  updateSchema: TblFailureGroupFollowInputUpdate,
  responseSchema: buildResponseSchema(
    TblFailureGroupFollowPlain,
    TblFailureGroupFollow,
  ),
}).app;

export default ControllerTblFailureGroupFollow;
