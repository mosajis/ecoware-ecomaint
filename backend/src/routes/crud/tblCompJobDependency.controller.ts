import { BaseController } from "@/utils/base.controller";
import { BaseService } from "@/utils/base.service";
import { PrismaClient } from "orm/generated/prisma";
import {
  TblCompJobDependency,
  TblCompJobDependencyInputCreate,
  TblCompJobDependencyInputUpdate,
  TblCompJobDependencyPlain,
} from "orm/generated/prismabox/TblCompJobDependency";
import { buildResponseSchema } from "@/utils/base.schema";
import { prisma } from "@/utils/prisma";

export const ServiceTblCompJobDependency = new BaseService(prisma.tblCompJobDependency);

const ControllerTblCompJobDependency = new BaseController({
  prefix: "/tblCompJobDependency",
  swagger: {
    tags: ["tblCompJobDependency"],
  },
  service: ServiceTblCompJobDependency,
  createSchema: TblCompJobDependencyInputCreate,
  updateSchema: TblCompJobDependencyInputUpdate,
  responseSchema: buildResponseSchema(TblCompJobDependencyPlain, TblCompJobDependency),
}).app;

export default ControllerTblCompJobDependency
