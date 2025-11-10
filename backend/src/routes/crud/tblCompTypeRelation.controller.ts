import { BaseController } from "@/utils/base.controller";
import { BaseService } from "@/utils/base.service";
import { PrismaClient } from "orm/generated/prisma";
import {
  TblCompTypeRelation,
  TblCompTypeRelationInputCreate,
  TblCompTypeRelationInputUpdate,
  TblCompTypeRelationPlain,
} from "orm/generated/prismabox/TblCompTypeRelation";
import { buildResponseSchema } from "@/utils/base.schema";
import { prisma } from "@/utils/prisma";

export const ServiceTblCompTypeRelation = new BaseService(prisma.tblCompTypeRelation);

const ControllerTblCompTypeRelation = new BaseController({
  prefix: "/tblCompTypeRelation",
  swagger: {
    tags: ["tblCompTypeRelation"],
  },
  service: ServiceTblCompTypeRelation,
  createSchema: TblCompTypeRelationInputCreate,
  updateSchema: TblCompTypeRelationInputUpdate,
  responseSchema: buildResponseSchema(TblCompTypeRelationPlain, TblCompTypeRelation),
}).app;

export default ControllerTblCompTypeRelation
