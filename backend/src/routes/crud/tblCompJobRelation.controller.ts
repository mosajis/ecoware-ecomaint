import { BaseController } from "@/utils/base.controller";
import { BaseService } from "@/utils/base.service";
import { PrismaClient } from "orm/generated/prisma";
import {
  TblCompJobRelation,
  TblCompJobRelationInputCreate,
  TblCompJobRelationInputUpdate,
  TblCompJobRelationPlain,
} from "orm/generated/prismabox/TblCompJobRelation";
import { buildResponseSchema } from "@/utils/base.schema";
import { prisma } from "@/utils/prisma";

export const ServiceTblCompJobRelation = new BaseService(prisma.tblCompJobRelation);

const ControllerTblCompJobRelation = new BaseController({
  prefix: "/tblCompJobRelation",
  swagger: {
    tags: ["tblCompJobRelation"],
  },
  service: ServiceTblCompJobRelation,
  createSchema: TblCompJobRelationInputCreate,
  updateSchema: TblCompJobRelationInputUpdate,
  responseSchema: buildResponseSchema(TblCompJobRelationPlain, TblCompJobRelation),
}).app;

export default ControllerTblCompJobRelation
